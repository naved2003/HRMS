using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IDesignationService
{
    Task<IEnumerable<DesignationDto>> GetAllAsync();
    Task<DesignationDto?> GetByIdAsync(int id);
    Task<IEnumerable<DesignationDto>> GetByDepartmentAsync(int departmentId);
    Task<DesignationDto> CreateAsync(CreateDesignationDto dto);
    Task<DesignationDto?> UpdateAsync(int id, UpdateDesignationDto dto);
    Task<bool> DeleteAsync(int id);
}
