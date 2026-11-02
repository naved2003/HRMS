using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Enums;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class LeaveService : ILeaveService
{
    private readonly ILeaveRepository _repository;
    private readonly HRMS.Infrastructure.HRMSDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ILogger<LeaveService> _logger;

    public LeaveService(ILeaveRepository repository, HRMS.Infrastructure.HRMSDbContext dbContext, IMapper mapper, ILogger<LeaveService> logger)
    {
        _repository = repository;
        _dbContext = dbContext;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<LeaveRequestDto?> ApplyLeaveAsync(ApplyLeaveDto dto)
    {
        var employee = await _dbContext.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        if (employee is null) throw new InvalidOperationException("Employee does not exist.");
        if (employee.Status == EmployeeStatus.Terminated)
            throw new InvalidOperationException("Cannot apply leave for a terminated employee.");

        var days = (dto.EndDate - dto.StartDate).Days + 1;
        if (days <= 0) throw new InvalidOperationException("End date must be greater than or equal to start date.");

        var entity = new LeaveRequest
        {
            EmployeeId = dto.EmployeeId,
            LeaveTypeId = dto.LeaveTypeId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            NumberOfDays = days,
            Reason = dto.Reason,
            Status = LeaveStatus.Pending,
            AppliedById = dto.AppliedById,
            AppliedOn = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repository.AddAsync(entity);
        _logger.LogInformation("Leave request {Id} applied by employee {EmployeeId}", entity.Id, entity.EmployeeId);
        var withDetails = await _repository.GetLeaveWithDetailsAsync(entity.Id);
        return withDetails is null ? null : _mapper.Map<LeaveRequestDto>(withDetails);
    }

    public async Task<LeaveRequestDto?> ApproveLeaveAsync(int id, ApproveLeaveDto dto)
    {
        var leave = await _repository.GetLeaveWithDetailsAsync(id);
        if (leave is null) return null;
        if (leave.Status != LeaveStatus.Pending)
            throw new InvalidOperationException("Only pending leaves can be approved.");

        leave.Status = LeaveStatus.Approved;
        leave.ApprovedById = dto.ApprovedById;
        leave.ApprovalRemarks = dto.ApprovalRemarks;
        leave.ApprovedOn = DateTime.UtcNow;
        leave.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(leave);
        var refreshed = await _repository.GetLeaveWithDetailsAsync(id);
        return refreshed is null ? null : _mapper.Map<LeaveRequestDto>(refreshed);
    }

    public async Task<LeaveRequestDto?> RejectLeaveAsync(int id, ApproveLeaveDto dto)
    {
        var leave = await _repository.GetLeaveWithDetailsAsync(id);
        if (leave is null) return null;
        if (leave.Status != LeaveStatus.Pending)
            throw new InvalidOperationException("Only pending leaves can be rejected.");

        leave.Status = LeaveStatus.Rejected;
        leave.ApprovedById = dto.ApprovedById;
        leave.ApprovalRemarks = dto.ApprovalRemarks;
        leave.ApprovedOn = DateTime.UtcNow;
        leave.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(leave);
        var refreshed = await _repository.GetLeaveWithDetailsAsync(id);
        return refreshed is null ? null : _mapper.Map<LeaveRequestDto>(refreshed);
    }

    public async Task<bool> CancelLeaveAsync(int id)
    {
        var leave = await _repository.GetByIdAsync(id);
        if (leave is null) return false;
        if (leave.Status != LeaveStatus.Pending && leave.Status != LeaveStatus.Approved)
            throw new InvalidOperationException("Only pending or approved leaves can be cancelled.");

        leave.Status = LeaveStatus.Cancelled;
        leave.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(leave);
        return true;
    }

    public async Task<IEnumerable<LeaveRequestDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<LeaveRequestDto>>(entities);
    }

    public async Task<IEnumerable<LeaveRequestDto>> GetPendingAsync()
    {
        var entities = await _repository.GetPendingRequestsAsync();
        return _mapper.Map<IEnumerable<LeaveRequestDto>>(entities);
    }

    public async Task<IEnumerable<LeaveRequestDto>> GetByEmployeeAsync(int employeeId)
    {
        var entities = await _repository.GetByEmployeeAsync(employeeId);
        return _mapper.Map<IEnumerable<LeaveRequestDto>>(entities);
    }

    public async Task<IEnumerable<LeaveTypeDto>> GetLeaveTypesAsync()
    {
        var types = await _dbContext.LeaveTypes.ToListAsync();
        return _mapper.Map<IEnumerable<LeaveTypeDto>>(types);
    }

    public async Task<LeaveTypeDto> CreateLeaveTypeAsync(LeaveTypeDto dto)
    {
        var entity = new LeaveType { Name = dto.Name, DefaultDays = dto.DefaultDays, IsPaid = dto.IsPaid };
        await _dbContext.LeaveTypes.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return _mapper.Map<LeaveTypeDto>(entity);
    }

    public async Task<bool> UpdateLeaveTypeAsync(int id, LeaveTypeDto dto)
    {
        var entity = await _dbContext.LeaveTypes.FirstOrDefaultAsync(lt => lt.Id == id);
        if (entity is null) return false;
        entity.Name = dto.Name;
        entity.DefaultDays = dto.DefaultDays;
        entity.IsPaid = dto.IsPaid;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteLeaveTypeAsync(int id)
    {
        var entity = await _dbContext.LeaveTypes.FirstOrDefaultAsync(lt => lt.Id == id);
        if (entity is null) return false;
        _dbContext.LeaveTypes.Remove(entity);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Auto-cancels pending leave requests when an employee transitions to Terminated status.
    /// Intended to be called by EmployeeService when status changes; safe to call from there via DI.
    /// </summary>
    public async Task AutoCancelPendingLeavesForEmployeeAsync(int employeeId)
    {
        var pending = await _dbContext.LeaveRequests
            .Where(l => l.EmployeeId == employeeId && l.Status == LeaveStatus.Pending)
            .ToListAsync();
        foreach (var leave in pending)
        {
            leave.Status = LeaveStatus.Cancelled;
            leave.UpdatedAt = DateTime.UtcNow;
        }
        if (pending.Count > 0)
        {
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Auto-cancelled {Count} pending leaves for employee {EmployeeId}", pending.Count, employeeId);
        }
    }
}
