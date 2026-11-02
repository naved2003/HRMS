using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface ILeaveService
{
    Task<LeaveRequestDto?> ApplyLeaveAsync(ApplyLeaveDto dto);
    Task<LeaveRequestDto?> ApproveLeaveAsync(int id, ApproveLeaveDto dto);
    Task<LeaveRequestDto?> RejectLeaveAsync(int id, ApproveLeaveDto dto);
    Task<bool> CancelLeaveAsync(int id);
    Task<IEnumerable<LeaveRequestDto>> GetAllAsync();
    Task<IEnumerable<LeaveRequestDto>> GetPendingAsync();
    Task<IEnumerable<LeaveRequestDto>> GetByEmployeeAsync(int employeeId);
    Task<IEnumerable<LeaveTypeDto>> GetLeaveTypesAsync();
    Task<LeaveTypeDto> CreateLeaveTypeAsync(LeaveTypeDto dto);
    Task<bool> UpdateLeaveTypeAsync(int id, LeaveTypeDto dto);
    Task<bool> DeleteLeaveTypeAsync(int id);
}
