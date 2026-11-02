using HRMS.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;

    public AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<int>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public sealed record RegisterDto(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        string Role);

    public sealed record ChangePasswordDto(string CurrentPassword, string NewPassword);

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) is not null)
            return Conflict(new { message = "Email already registered." });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            EmailConfirmed = true,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            HireDate = DateTime.UtcNow,
            IsActive = true
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        if (!await _roleManager.RoleExistsAsync(dto.Role))
            return BadRequest(new { message = $"Role '{dto.Role}' does not exist." });

        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok(new { id = user.Id, email = user.Email, role = dto.Role });
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToString();
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userIdStr);
        if (user is null) return NotFound();

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    [HttpGet("roles")]
    [Authorize]
    public IActionResult Roles()
    {
        var roles = _roleManager.Roles.Select(r => r.Name).Where(n => n != null).ToArray();
        return Ok(roles);
    }
}
