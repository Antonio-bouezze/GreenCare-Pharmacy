using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Api.DTOs;

public record RegisterRequest(
    [Required, MaxLength(160)] string FullName,
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MinLength(8)] string Password);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record ProductCreateRequest(
    [Required, MaxLength(180)] string Name,
    [Required, MaxLength(2000)] string Description,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Range(0, int.MaxValue)] int StockQuantity,
    [Range(1, int.MaxValue)] int CategoryId,
    [MaxLength(1000)] string ImageUrl,
    bool IsActive,
    bool RequiresPrescription,
    [MaxLength(180)] string Manufacturer,
    DateTime? ExpiryDate,
    [MaxLength(80)] string? Dosage);

public record ProductUpdateRequest(
    [Required, MaxLength(180)] string Name,
    [Required, MaxLength(2000)] string Description,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Range(0, int.MaxValue)] int StockQuantity,
    [Range(1, int.MaxValue)] int CategoryId,
    [MaxLength(1000)] string ImageUrl,
    bool IsActive,
    bool RequiresPrescription,
    [MaxLength(180)] string Manufacturer,
    DateTime? ExpiryDate,
    [MaxLength(80)] string? Dosage);

public record CategoryRequest(
    [Required, MaxLength(120)] string Name,
    [MaxLength(500)] string Description);

public record OrderCreateRequest(
    [Required, MinLength(1)] List<OrderItemCreateRequest> Items,
    [Required, MaxLength(160)] string FullName,
    [Required, MaxLength(40)] string PhoneNumber,
    [Required, MaxLength(500)] string Address,
    [Required, MaxLength(120)] string City,
    [MaxLength(1000)] string? Notes);

public record OrderItemCreateRequest(
    [Range(1, int.MaxValue)] int ProductId,
    [Range(1, 99)] int Quantity);

public record UpdateOrderStatusRequest([Required] string Status);

public record UserProfileUpdateRequest(
    [Required, MaxLength(160)] string FullName,
    [Required, EmailAddress, MaxLength(256)] string Email);
