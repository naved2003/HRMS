using HRMS.Core.Enums;

namespace HRMS.Services.DTOs;

public record PayrollRecordDto
{
    public int Id { get; init; }
    public int EmployeeId { get; init; }
    public string? EmployeeName { get; init; }
    public string? DepartmentName { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal GrossSalary { get; init; }
    public decimal TotalDeductions { get; init; }
    public decimal NetPay { get; init; }
    public DateTime ProcessedOn { get; init; } = DateTime.UtcNow;
    public PayrollStatus Status { get; init; }
    public string? Remarks { get; init; }
    public int? PayslipId { get; init; }
}

public record PayslipDto
{
    public int Id { get; init; }
    public int PayrollRecordId { get; init; }
    public int EmployeeId { get; init; }
    public string? EmployeeName { get; init; }
    public string? EmployeeCode { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal Basic { get; init; }
    public decimal HRA { get; init; }
    public decimal Conveyance { get; init; }
    public decimal Medical { get; init; }
    public decimal SpecialAllowance { get; init; }
    public decimal TotalEarnings { get; init; }
    public decimal PF { get; init; }
    public decimal ESI { get; init; }
    public decimal Tax { get; init; }
    public decimal TotalDeductions { get; init; }
    public decimal NetPay { get; init; }
    public DateTime GeneratedOn { get; init; } = DateTime.UtcNow;
}

public record ProcessPayrollDto
{
    public int EmployeeId { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
    public string? Remarks { get; init; }
}

public record SalaryStructureDto
{
    public int Id { get; init; }
    public int DesignationId { get; init; }
    public string? DesignationTitle { get; init; }
    public decimal Basic { get; init; }
    public decimal HRA { get; init; }
    public decimal Conveyance { get; init; }
    public decimal Medical { get; init; }
    public decimal Special { get; init; }
    public decimal PF { get; init; }
    public decimal ESI { get; init; }
    public decimal Tax { get; init; }
    public DateTime EffectiveFrom { get; init; } = DateTime.UtcNow;
}
