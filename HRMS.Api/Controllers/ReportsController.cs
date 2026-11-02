using HRMS.Core.Enums;
using HRMS.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager")]
public sealed class ReportsController : ControllerBase
{
    private readonly HRMSDbContext _db;
    public ReportsController(HRMSDbContext db) => _db = db;

    // GET: /api/reports/attendance?from=&to=&departmentId=
    [HttpGet("attendance")]
    public async Task<IActionResult> AttendanceReport([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int? departmentId, [FromQuery] string? format)
    {
        var query = _db.Attendance
            .Include(a => a.Employee).ThenInclude(e => e!.Department)
            .AsQueryable();
        if (from.HasValue) query = query.Where(a => a.Date >= from.Value);
        if (to.HasValue) query = query.Where(a => a.Date <= to.Value);
        if (departmentId.HasValue) query = query.Where(a => a.Employee!.DepartmentId == departmentId.Value);

        var data = await query.OrderBy(a => a.Date).ToListAsync();
        var rows = data.Select(a => new
        {
            a.Id,
            Employee = a.Employee != null ? $"{a.Employee.FirstName} {a.Employee.LastName}" : "",
            Department = a.Employee?.Department?.Name,
            Date = a.Date.ToString("yyyy-MM-dd"),
            CheckIn = a.CheckIn?.ToString(@"hh\:mm"),
            CheckOut = a.CheckOut?.ToString(@"hh\:mm"),
            Status = a.Status.ToString(),
            WorkHours = a.WorkHours,
            Remarks = a.Remarks
        });

        return ResolveOutput(format, rows, "AttendanceReport", CsvAttendance);
    }

    // GET: /api/reports/leave?from=&to=&status=
    [HttpGet("leave")]
    public async Task<IActionResult> LeaveReport([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] LeaveStatus? status, [FromQuery] string? format)
    {
        var query = _db.LeaveRequests
            .Include(l => l.Employee).ThenInclude(e => e!.Department)
            .Include(l => l.LeaveType)
            .AsQueryable();
        if (from.HasValue) query = query.Where(l => l.StartDate >= from.Value);
        if (to.HasValue) query = query.Where(l => l.EndDate <= to.Value);
        if (status.HasValue) query = query.Where(l => l.Status == status.Value);

        var data = await query.OrderBy(l => l.StartDate).ToListAsync();
        var rows = data.Select(l => new
        {
            l.Id,
            Employee = l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}" : "",
            Department = l.Employee?.Department?.Name,
            LeaveType = l.LeaveType?.Name,
            StartDate = l.StartDate.ToString("yyyy-MM-dd"),
            EndDate = l.EndDate.ToString("yyyy-MM-dd"),
            NumberOfDays = l.NumberOfDays,
            Status = l.Status.ToString(),
            Reason = l.Reason
        });

        return ResolveOutput(format, rows, "LeaveReport", CsvLeave);
    }

    // GET: /api/reports/payroll?month=&year=&departmentId=
    [HttpGet("payroll")]
    public async Task<IActionResult> PayrollReport([FromQuery] int month, [FromQuery] int year, [FromQuery] int? departmentId, [FromQuery] string? format)
    {
        var query = _db.PayrollRecords
            .Include(p => p.Employee).ThenInclude(e => e!.Department)
            .Where(p => p.Month == month && p.Year == year);
        if (departmentId.HasValue)
            query = query.Where(p => p.Employee!.DepartmentId == departmentId.Value);

        var data = await query.OrderBy(p => p.Employee!.FirstName).ToListAsync();
        var rows = data.Select(p => new
        {
            p.Id,
            Employee = p.Employee != null ? $"{p.Employee.FirstName} {p.Employee.LastName}" : "",
            Department = p.Employee?.Department?.Name,
            p.Month,
            p.Year,
            Gross = p.GrossSalary,
            Deductions = p.TotalDeductions,
            Net = p.NetPay,
            Status = p.Status.ToString(),
            ProcessedOn = p.ProcessedOn.ToString("yyyy-MM-dd HH:mm")
        });

        return ResolveOutput(format, rows, "PayrollReport", CsvPayroll);
    }

    // GET: /api/reports/employees?departmentId=
    [HttpGet("employees")]
    public async Task<IActionResult> EmployeesReport([FromQuery] int? departmentId, [FromQuery] string? format)
    {
        var query = _db.Employees.Include(e => e.Department).Include(e => e.Designation).AsQueryable();
        if (departmentId.HasValue) query = query.Where(e => e.DepartmentId == departmentId.Value);

        var data = await query.OrderBy(e => e.FirstName).ToListAsync();
        var rows = data.Select(e => new
        {
            e.Id,
            e.EmployeeCode,
            Name = $"{e.FirstName} {e.LastName}",
            e.Email,
            Department = e.Department?.Name,
            Designation = e.Designation?.Title,
            EmploymentType = e.EmploymentType.ToString(),
            Status = e.Status.ToString(),
            HireDate = e.HireDate.ToString("yyyy-MM-dd"),
            BasicSalary = e.BasicSalary
        });

        return ResolveOutput(format, rows, "EmployeeReport", CsvEmployee);
    }

    private IActionResult ResolveOutput(string? format, object rows, string fileName, Func<IEnumerable<dynamic>, string> csvBuilder)
    {
        if (string.Equals(format, "csv", StringComparison.OrdinalIgnoreCase))
        {
            var csv = csvBuilder((IEnumerable<dynamic>)rows);
            return File(Encoding.UTF8.GetBytes(csv), "text/csv", $"{fileName}.csv");
        }
        return Ok(rows);
    }

    private static string CsvAttendance(IEnumerable<dynamic> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Id,Employee,Department,Date,CheckIn,CheckOut,Status,WorkHours,Remarks");
        foreach (dynamic r in rows)
            sb.AppendLine($"{r.Id},{Escape(r.Employee)},{Escape(r.Department)},{r.Date},{r.CheckIn},{r.CheckOut},{r.Status},{r.WorkHours},{Escape(r.Remarks)}");
        return sb.ToString();
    }

    private static string CsvLeave(IEnumerable<dynamic> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Id,Employee,Department,LeaveType,StartDate,EndDate,NumberOfDays,Status,Reason");
        foreach (dynamic r in rows)
            sb.AppendLine($"{r.Id},{Escape(r.Employee)},{Escape(r.Department)},{Escape(r.LeaveType)},{r.StartDate},{r.EndDate},{r.NumberOfDays},{r.Status},{Escape(r.Reason)}");
        return sb.ToString();
    }

    private static string CsvPayroll(IEnumerable<dynamic> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Id,Employee,Department,Month,Year,Gross,Deductions,Net,Status,ProcessedOn");
        foreach (dynamic r in rows)
            sb.AppendLine($"{r.Id},{Escape(r.Employee)},{Escape(r.Department)},{r.Month},{r.Year},{r.Gross},{r.Deductions},{r.Net},{r.Status},{r.ProcessedOn}");
        return sb.ToString();
    }

    private static string CsvEmployee(IEnumerable<dynamic> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Id,EmployeeCode,Name,Email,Department,Designation,EmploymentType,Status,HireDate,BasicSalary");
        foreach (dynamic r in rows)
            sb.AppendLine($"{r.Id},{r.EmployeeCode},{Escape(r.Name)},{r.Email},{Escape(r.Department)},{Escape(r.Designation)},{r.EmploymentType},{r.Status},{r.HireDate},{r.BasicSalary}");
        return sb.ToString();
    }

    private static string Escape(object? value) => value?.ToString()?.Contains(',') == true
        ? $"\"{value}\""
        : value?.ToString() ?? string.Empty;
}
