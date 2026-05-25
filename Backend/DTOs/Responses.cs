namespace Pharmacy.Api.DTOs;

public record AuthResponse(string Token, DateTime ExpiresAt, UserProfileResponse User);

public record UserProfileResponse(int Id, string FullName, string Email, string Role, DateTime CreatedAt);

public record CategoryResponse(int Id, string Name, string Description);

public record ProductResponse(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    int CategoryId,
    string CategoryName,
    string ImageUrl,
    bool IsActive,
    bool RequiresPrescription,
    string Manufacturer,
    DateTime? ExpiryDate,
    string? Dosage,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record OrderItemResponse(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductImageUrl,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice);

public record OrderResponse(
    int Id,
    int UserId,
    string CustomerName,
    DateTime OrderDate,
    string Status,
    decimal TotalAmount,
    string FullName,
    string PhoneNumber,
    string Address,
    string City,
    string? Notes,
    List<OrderItemResponse> Items);

public record DashboardStatsResponse(
    int TotalProducts,
    int TotalOrders,
    int TotalUsers,
    decimal RevenueTotal,
    List<OrderResponse> RecentOrders,
    List<ProductResponse> LowStockProducts);
