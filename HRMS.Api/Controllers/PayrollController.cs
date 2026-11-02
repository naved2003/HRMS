using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class PayrollController : ControllerBase
{
    private readonly IPayrollService _service;
    public PayrollController(IPayrollService service) => _service = service;

    // Angular calls POST /api/payroll/process with body { employeeId, month, year, remarks }
    [HttpPost("process")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<PayrollRecordDto>> ProcessBody([FromBody] ProcessPayrollDto req)
    {
        var dto = await _service.ProcessPayrollAsync(req.EmployeeId, req.Month, req.Year, req.Remarks);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost("process/{employeeId:int}/{month:int}/{year:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<PayrollRecordDto>> Process(int employeeId, int month, int year, [FromQuery] string? remarks)
    {
        var dto = await _service.ProcessPayrollAsync(employeeId, month, year, remarks);
        return dto is null ? NotFound() : Ok(dto);
    }

    // Angular calls POST /api/payroll/process-bulk with body { month, year }
    [HttpPost("process-bulk")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<int>> ProcessBulkBody([FromBody] ProcessPayrollDto req)
        => Ok(await _service.ProcessBulkPayrollAsync(req.Month, req.Year));

    [HttpPost("process-bulk/{month:int}/{year:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<int>> ProcessBulk(int month, int year)
        => Ok(await _service.ProcessBulkPayrollAsync(month, year));

    [HttpGet("{payrollRecordId:int}/payslip")]
    public async Task<ActionResult<PayslipDto>> GetPayslip(int payrollRecordId)
    {
        var dto = await _service.GetPayslipAsync(payrollRecordId);
        return dto is null ? NotFound() : Ok(dto);
    }

    // Angular calls GET /api/payroll?month=10&year=2026 (query string, not route segment)
    [HttpGet]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<IEnumerable<PayrollRecordDto>>> GetByQuery([FromQuery] int? month, [FromQuery] int? year)
    {
        if (month.HasValue && year.HasValue)
        {
            return Ok(await _service.GetByMonthYearAsync(month.Value, year.Value));
        }
        // Fallback to current month/year if no filter is provided
        var now = DateTime.UtcNow;
        return Ok(await _service.GetByMonthYearAsync(now.Month, now.Year));
    }

    [HttpGet("month-year/{month:int}/{year:int}")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<IEnumerable<PayrollRecordDto>>> GetByMonthYear(int month, int year)
        => Ok(await _service.GetByMonthYearAsync(month, year));
}
