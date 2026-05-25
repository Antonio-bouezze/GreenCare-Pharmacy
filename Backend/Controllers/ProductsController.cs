using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductResponse>>> GetProducts([FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] string? sort)
    {
        return Ok(await productService.GetProductsAsync(search, categoryId, sort));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetProduct(int id)
    {
        return Ok(await productService.GetByIdAsync(id, User.IsInRole("Admin")));
    }

    [HttpGet("category/{categoryId:int}")]
    public async Task<ActionResult<List<ProductResponse>>> GetByCategory(int categoryId)
    {
        return Ok(await productService.GetProductsAsync(null, categoryId, null));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/all")]
    public async Task<ActionResult<List<ProductResponse>>> GetAllForAdmin([FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] string? sort)
    {
        return Ok(await productService.GetProductsAsync(search, categoryId, sort, true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin")]
    public async Task<ActionResult<ProductResponse>> Create(ProductCreateRequest request)
    {
        var created = await productService.CreateAsync(request);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("admin/{id:int}")]
    public async Task<ActionResult<ProductResponse>> Update(int id, ProductUpdateRequest request)
    {
        return Ok(await productService.UpdateAsync(id, request));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("admin/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await productService.DeleteAsync(id);
        return NoContent();
    }
}
