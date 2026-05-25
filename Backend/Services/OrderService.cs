using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Data;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Services;

public class OrderService(ApplicationDbContext db)
{
    public async Task<OrderResponse> CreateAsync(int userId, OrderCreateRequest request)
    {
        if (request.Items.Count == 0)
        {
            throw new InvalidOperationException("Cart is empty.");
        }

        await using var transaction = await db.Database.BeginTransactionAsync();
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await db.Products.Where(p => productIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id);

        var order = new Order
        {
            UserId = userId,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Address = request.Address.Trim(),
            City = request.City.Trim(),
            Notes = request.Notes?.Trim(),
            Status = OrderStatuses.Pending
        };

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product) || !product.IsActive)
            {
                throw new InvalidOperationException("One or more products are unavailable.");
            }

            if (product.RequiresPrescription)
            {
                throw new InvalidOperationException($"{product.Name} requires a prescription and cannot be checked out in this demo.");
            }

            if (product.StockQuantity < item.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for {product.Name}.");
            }

            product.StockQuantity -= item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                TotalPrice = product.Price * item.Quantity
            });
        }

        order.TotalAmount = order.OrderItems.Sum(i => i.TotalPrice);
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();

        return await GetByIdAsync(order.Id, userId, false);
    }

    public async Task<List<OrderResponse>> GetForUserAsync(int userId)
    {
        var orders = await IncludeOrderGraph(db.Orders)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return orders.Select(o => o.ToResponse()).ToList();
    }

    public async Task<OrderResponse> GetByIdAsync(int orderId, int requesterId, bool isAdmin)
    {
        var order = await IncludeOrderGraph(db.Orders).FirstOrDefaultAsync(o => o.Id == orderId)
            ?? throw new KeyNotFoundException("Order was not found.");

        if (!isAdmin && order.UserId != requesterId)
        {
            throw new UnauthorizedAccessException("You do not have access to this order.");
        }

        return order.ToResponse();
    }

    public async Task<List<OrderResponse>> GetAllAsync()
    {
        var orders = await IncludeOrderGraph(db.Orders)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
        return orders.Select(o => o.ToResponse()).ToList();
    }

    public async Task<OrderResponse> UpdateStatusAsync(int orderId, string status)
    {
        if (!OrderStatuses.All.Contains(status))
        {
            throw new InvalidOperationException("Invalid order status.");
        }

        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Order was not found.");
        order.Status = status;
        await db.SaveChangesAsync();
        return await GetByIdAsync(orderId, 0, true);
    }

    private static IQueryable<Order> IncludeOrderGraph(IQueryable<Order> query) =>
        query.Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product);
}
