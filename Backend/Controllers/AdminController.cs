using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Data;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<DashboardStatsResponse>> DashboardStats()
    {
        var totalProducts = await db.Products.CountAsync();
        var totalOrders = await db.Orders.CountAsync();
        var totalUsers = await db.Users.CountAsync();
        var revenue = await db.Orders
            .Where(o => o.Status != "Cancelled")
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

        var recentOrders = await db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.OrderDate)
            .Take(6)
            .ToListAsync();

        var lowStock = await db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.StockQuantity <= 10)
            .OrderBy(p => p.StockQuantity)
            .Take(8)
            .ToListAsync();

        return Ok(new DashboardStatsResponse(
            totalProducts,
            totalOrders,
            totalUsers,
            revenue,
            recentOrders.Select(o => o.ToResponse()).ToList(),
            lowStock.Select(p => p.ToResponse()).ToList()));
    }
}
