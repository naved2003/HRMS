using HRMS.Core.Enums;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;
    public AttendanceController(IAttendanceService service) => _service = service;

    [HttpPost("mark")]
    [HttpPost]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<AttendanceDto>> Mark([FromBody] MarkAttendanceDto dto)
    {
        try
        {
            var marked = await _service.MarkAttendanceAsync(dto);
            return marked is null ? BadRequest() : Ok(marked);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<AttendanceDto>> Update(int id, [FromBody] UpdateAttendanceDto dto)
    {
        var updated = await _service.UpdateAttendanceAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    // Angular calls /api/attendance/employee/{id} (without the "by-" prefix)
    [HttpGet("employee/{employeeId:int}")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByEmployee(
        int employeeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        => Ok(await _service.GetByEmployeeAsync(employeeId, from, to));

    // Keep the original route as well for backward compat
    [HttpGet("by-employee/{employeeId:int}")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByEmployeeLegacy(
        int employeeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        => Ok(await _service.GetByEmployeeAsync(employeeId, from, to));

    // Angular calls GET /api/attendance?date=2026-10-12 (query string, not route segment)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetAll(
        [FromQuery] DateTime? date,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] AttendanceStatus? status)
    {
        // If ?date=X is provided, return records for that date.
        if (date.HasValue)
        {
            return Ok(await _service.GetByDateAsync(date.Value));
        }
        // If ?from=X&to=Y is provided, return records in that range.
        if (from.HasValue && to.HasValue)
        {
            return Ok(await _service.GetByRangeAsync(from.Value, to.Value, status));
        }
        // Otherwise return range for last 30 days (sensible default).
        var end = DateTime.Today;
        var start = end.AddDays(-30);
        return Ok(await _service.GetByRangeAsync(start, end, status));
    }

    // Keep the original routes as well for backward compatibility.
    [HttpGet("by-date/{date:datetime}")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByDate(DateTime date)
        => Ok(await _service.GetByDateAsync(date));

    [HttpGet("range")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByRange(
        [FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] AttendanceStatus? status)
        => Ok(await _service.GetByRangeAsync(from, to, status));
}
