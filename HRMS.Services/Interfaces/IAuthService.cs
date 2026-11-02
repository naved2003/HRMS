using HRMS.Core.Entities;
using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task LogoutAsync();
    Task<UserDto?> GetCurrentUserAsync(int userId);
}
