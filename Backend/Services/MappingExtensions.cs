using Pharmacy.Api.DTOs;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Services;

public static class MappingExtensions
{
    public static UserProfileResponse ToProfileResponse(this User user) =>
        new(user.Id, user.FullName, user.Email, user.Role, user.CreatedAt);

    public static CategoryResponse ToResponse(this Category category) =>
        new(category.Id, category.Name, category.Description);

    public static ProductResponse ToResponse(this Product product) =>
        new(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.CategoryId,
            product.Category?.Name ?? string.Empty,
            product.ImageUrl,
            product.IsActive,
            product.RequiresPrescription,
            product.Manufacturer,
            product.ExpiryDate,
            product.Dosage,
            product.CreatedAt,
            product.UpdatedAt);

    public static OrderResponse ToResponse(this Order order) =>
        new(
            order.Id,
            order.UserId,
            order.User?.FullName ?? order.FullName,
            order.OrderDate,
            order.Status,
            order.TotalAmount,
            order.FullName,
            order.PhoneNumber,
            order.Address,
            order.City,
            order.Notes,
            order.OrderItems.Select(i => new OrderItemResponse(
                i.Id,
                i.ProductId,
                i.Product?.Name ?? "Unavailable product",
                i.Product?.ImageUrl,
                i.Quantity,
                i.UnitPrice,
                i.TotalPrice)).ToList());
}
