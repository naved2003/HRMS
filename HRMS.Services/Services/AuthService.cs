using HRMS.Core.Entities;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class AuthService : IAuthService
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null || !user.IsActive)
        {
            _logger.LogWarning("Login failed for {Email}: user not found or inactive", dto.Email);
            return null;
        }

        var result = await _signInManager.PasswordSignInAsync(user.UserName!, dto.Password, dto.RememberMe, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Login failed for {Email}: bad password or locked out", dto.Email);
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        var expireTimeSpan = _configuration.GetValue<TimeSpan?>("Cookie:ExpireTimeSpan") ?? TimeSpan.FromHours(8);
        return new AuthResponseDto
        {
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            Roles = roles.ToArray(),
            ExpiresAt = DateTime.UtcNow.Add(expireTimeSpan),
        };
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    public async Task<UserDto?> GetCurrentUserAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return null;
        var roles = await _userManager.GetRolesAsync(user);
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToArray(),
        };
    }
}
