using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}
