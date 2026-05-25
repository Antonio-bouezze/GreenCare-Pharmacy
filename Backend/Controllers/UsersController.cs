using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Api.Data;
using Pharmacy.Api.DTOs;
using Pharmacy.Api.Services;

namespace Pharmacy.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileResponse>> Profile()
    {
        var user = await GetCurrentUser();
        return Ok(user.ToProfileResponse());
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileResponse>> UpdateProfile(UserProfileUpdateRequest request)
    {
        var user = await GetCurrentUser();
        var email = request.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(u => u.Email == email && u.Id != user.Id))
        {
            return BadRequest(new { message = "Email is already used by another account." });
        }

        user.FullName = request.FullName.Trim();
        user.Email = email;
        await db.SaveChangesAsync();
        return Ok(user.ToProfileResponse());
    }

    private async Task<Pharmacy.Api.Models.User> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await db.Users.FindAsync(userId) ?? throw new KeyNotFoundException("User was not found.");
    }
}
