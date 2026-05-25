using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Models;

namespace Pharmacy.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        if (!await db.Users.AnyAsync())
        {
            db.Users.AddRange(
                new User
                {
                    FullName = "Pharmacy Admin",
                    Email = "admin@pharmacy.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = UserRoles.Admin
                },
                new User
                {
                    FullName = "Demo Customer",
                    Email = "user@pharmacy.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                    Role = UserRoles.User
                });
        }

        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Name = "Pain Relief", Description = "Everyday non-prescription pain relief products." },
                new Category { Name = "Cold & Flu", Description = "Seasonal wellness and comfort products." },
                new Category { Name = "Vitamins & Supplements", Description = "General wellness supplements." },
                new Category { Name = "First Aid", Description = "Home and travel first aid essentials." },
                new Category { Name = "Skin Care", Description = "Gentle skin care and topical care items." },
                new Category { Name = "Baby Care", Description = "Baby and family care basics." },
                new Category { Name = "Personal Care", Description = "Daily health and personal care products." });
            await db.SaveChangesAsync();
        }

        if (!await db.Products.AnyAsync())
        {
            var categories = await db.Categories.ToDictionaryAsync(c => c.Name);
            db.Products.AddRange(
                Product("Paracetamol 500mg", "General pain and fever relief tablets. Use only as directed on the label.", 4.99m, 120, categories["Pain Relief"].Id, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80", "GreenCare Labs", "500mg", false),
                Product("Ibuprofen 200mg", "Non-prescription anti-inflammatory tablets for temporary relief. Read the label before use.", 6.49m, 85, categories["Pain Relief"].Id, "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=900&q=80", "WellPlus", "200mg", false),
                Product("Vitamin C Tablets", "Daily vitamin C supplement for general wellness support.", 9.99m, 60, categories["Vitamins & Supplements"].Id, "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80", "NutriCare", "1000mg", false),
                Product("Digital Thermometer", "Fast-reading digital thermometer for home temperature checks.", 12.50m, 35, categories["Personal Care"].Id, "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=900&q=80", "MediTech", null, false),
                Product("Cough Syrup", "Soothing cough syrup product. Follow age and dosage directions carefully.", 7.75m, 25, categories["Cold & Flu"].Id, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80", "CareWell", "100ml", false),
                Product("First Aid Kit", "Compact kit with bandages, gauze, antiseptic wipes, and basic first aid supplies.", 18.99m, 18, categories["First Aid"].Id, "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=900&q=80", "SafeHome", null, false),
                Product("Antiseptic Cream", "Topical antiseptic cream for minor skin care use as directed.", 5.25m, 42, categories["Skin Care"].Id, "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80", "DermaSoft", "30g", false),
                Product("Allergy Relief Tablets", "Allergy relief tablets for seasonal symptom support. May cause drowsiness.", 8.40m, 0, categories["Cold & Flu"].Id, "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80", "AllerEase", "10mg", true));
        }

        await db.SaveChangesAsync();
    }

    private static Product Product(string name, string description, decimal price, int stock, int categoryId, string imageUrl, string manufacturer, string? dosage, bool prescription)
    {
        return new Product
        {
            Name = name,
            Description = description,
            Price = price,
            StockQuantity = stock,
            CategoryId = categoryId,
            ImageUrl = imageUrl,
            Manufacturer = manufacturer,
            Dosage = dosage,
            RequiresPrescription = prescription,
            ExpiryDate = DateTime.UtcNow.AddYears(2)
        };
    }
}
