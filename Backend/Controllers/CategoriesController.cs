using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Data;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Models;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryResponse>>> Get()
    {
        var categories = await db.Categories.OrderBy(c => c.Name).ToListAsync();
        return Ok(categories.Select(c => c.ToResponse()));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin")]
    public async Task<ActionResult<CategoryResponse>> Create(CategoryRequest request)
    {
        if (await db.Categories.AnyAsync(c => c.Name == request.Name.Trim()))
        {
            return BadRequest(new { message = "A category with this name already exists." });
        }

        var category = new Category { Name = request.Name.Trim(), Description = request.Description.Trim() };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = category.Id }, category.ToResponse());
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("admin/{id:int}")]
    public async Task<ActionResult<CategoryResponse>> Update(int id, CategoryRequest request)
    {
        var category = await db.Categories.FindAsync(id) ?? throw new KeyNotFoundException("Category was not found.");
        category.Name = request.Name.Trim();
        category.Description = request.Description.Trim();
        await db.SaveChangesAsync();
        return Ok(category.ToResponse());
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("admin/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new KeyNotFoundException("Category was not found.");

        if (category.Products.Any())
        {
            return BadRequest(new { message = "Move or deactivate products before deleting this category." });
        }

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
