using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Data;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Services;

public class ProductService(ApplicationDbContext db)
{
    public async Task<List<ProductResponse>> GetProductsAsync(string? search, int? categoryId, string? sort, bool includeInactive = false)
    {
        var query = db.Products.Include(p => p.Category).AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(p => p.Name.Contains(term) || p.Description.Contains(term));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        query = sort switch
        {
            "price_desc" => query.OrderByDescending(p => p.Price),
            "price_asc" => query.OrderBy(p => p.Price),
            "name_desc" => query.OrderByDescending(p => p.Name),
            _ => query.OrderBy(p => p.Name)
        };

        return await query.Select(p => p.ToResponse()).ToListAsync();
    }

    public async Task<ProductResponse> GetByIdAsync(int id, bool includeInactive = false)
    {
        var product = await db.Products.Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && (includeInactive || p.IsActive));

        return product?.ToResponse() ?? throw new KeyNotFoundException("Product was not found.");
    }

    public async Task<ProductResponse> CreateAsync(ProductCreateRequest request)
    {
        await EnsureCategoryExists(request.CategoryId);
        var product = new Product();
        Apply(product, request.Name, request.Description, request.Price, request.StockQuantity, request.CategoryId, request.ImageUrl, request.IsActive, request.RequiresPrescription, request.Manufacturer, request.ExpiryDate, request.Dosage);
        db.Products.Add(product);
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(p => p.Category).LoadAsync();
        return product.ToResponse();
    }

    public async Task<ProductResponse> UpdateAsync(int id, ProductUpdateRequest request)
    {
        await EnsureCategoryExists(request.CategoryId);
        var product = await db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("Product was not found.");

        Apply(product, request.Name, request.Description, request.Price, request.StockQuantity, request.CategoryId, request.ImageUrl, request.IsActive, request.RequiresPrescription, request.Manufacturer, request.ExpiryDate, request.Dosage);
        product.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(p => p.Category).LoadAsync();
        return product.ToResponse();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await db.Products.FindAsync(id)
            ?? throw new KeyNotFoundException("Product was not found.");
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    private async Task EnsureCategoryExists(int categoryId)
    {
        if (!await db.Categories.AnyAsync(c => c.Id == categoryId))
        {
            throw new InvalidOperationException("Selected category does not exist.");
        }
    }

    private static void Apply(Product product, string name, string description, decimal price, int stockQuantity, int categoryId, string imageUrl, bool isActive, bool requiresPrescription, string manufacturer, DateTime? expiryDate, string? dosage)
    {
        product.Name = name.Trim();
        product.Description = description.Trim();
        product.Price = price;
        product.StockQuantity = stockQuantity;
        product.CategoryId = categoryId;
        product.ImageUrl = imageUrl.Trim();
        product.IsActive = isActive;
        product.RequiresPrescription = requiresPrescription;
        product.Manufacturer = manufacturer.Trim();
        product.ExpiryDate = expiryDate;
        product.Dosage = dosage?.Trim();
    }
}
