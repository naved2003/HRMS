using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Enums;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class AttendanceService : IAttendanceService
{
    private static readonly TimeSpan LateThreshold = new(9, 30, 0);

    private readonly IAttendanceRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AttendanceService> _logger;

    public AttendanceService(IAttendanceRepository repository, IMapper mapper, ILogger<AttendanceService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AttendanceDto?> MarkAttendanceAsync(MarkAttendanceDto dto)
    {
        var existing = await _repository.GetByEmployeeAndDateAsync(dto.EmployeeId, dto.Date);
        if (existing is not null)
        {
            throw new InvalidOperationException("Attendance already marked for this employee/date. Use update endpoint instead.");
        }

        var entity = _mapper.Map<Attendance>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        entity.Status = ResolveStatus(dto.CheckIn, dto.CheckOut);
        entity.WorkHours = dto.CheckIn.HasValue && dto.CheckOut.HasValue
            ? Math.Round((decimal)(dto.CheckOut.Value - dto.CheckIn.Value).TotalHours, 2)
            : null;
        await _repository.AddAsync(entity);
        _logger.LogInformation("Attendance marked for employee {EmployeeId} on {Date}", entity.EmployeeId, entity.Date);
        return _mapper.Map<AttendanceDto>(entity);
    }

    public async Task<AttendanceDto?> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;

        if (dto.CheckIn.HasValue) existing.CheckIn = dto.CheckIn;
        if (dto.CheckOut.HasValue) existing.CheckOut = dto.CheckOut;
        if (dto.Status.HasValue) existing.Status = dto.Status.Value;
        else existing.Status = ResolveStatus(existing.CheckIn, existing.CheckOut);
        if (dto.WorkHours.HasValue) existing.WorkHours = dto.WorkHours;
        else if (existing.CheckIn.HasValue && existing.CheckOut.HasValue)
            existing.WorkHours = Math.Round((decimal)(existing.CheckOut.Value - existing.CheckIn.Value).TotalHours, 2);
        if (dto.Remarks is not null) existing.Remarks = dto.Remarks;

        await _repository.UpdateAsync(existing);
        return _mapper.Map<AttendanceDto>(existing);
    }

    public async Task<IEnumerable<AttendanceDto>> GetByEmployeeAsync(int employeeId, DateTime? from, DateTime? to)
    {
        var entities = await _repository.GetByEmployeeAsync(employeeId, from, to);
        return _mapper.Map<IEnumerable<AttendanceDto>>(entities);
    }

    public async Task<IEnumerable<AttendanceDto>> GetByDateAsync(DateTime date)
    {
        var entities = await _repository.GetByDateAsync(date);
        return _mapper.Map<IEnumerable<AttendanceDto>>(entities);
    }

    public async Task<IEnumerable<AttendanceDto>> GetByRangeAsync(DateTime from, DateTime to, AttendanceStatus? status = null)
    {
        var all = (await _repository.GetAllAsync())
            .Where(a => a.Date >= from && a.Date <= to);
        if (status.HasValue)
            all = all.Where(a => a.Status == status.Value);
        return _mapper.Map<IEnumerable<AttendanceDto>>(all);
    }

    private static AttendanceStatus ResolveStatus(TimeSpan? checkIn, TimeSpan? checkOut)
    {
        if (!checkIn.HasValue) return AttendanceStatus.Absent;
        if (checkIn.Value > LateThreshold) return AttendanceStatus.Late;
        if (!checkOut.HasValue) return AttendanceStatus.Absent; // missing checkout -> treat as absent unless overridden
        var hours = (checkOut.Value - checkIn.Value).TotalHours;
        if (hours < 4) return AttendanceStatus.HalfDay;
        return AttendanceStatus.Present;
    }
}
