using HRMS.Core.Enums;

namespace HRMS.Services.DTOs;

public record EmployeeDto
{
    public int Id { get; init; }
    public string EmployeeCode { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? Address { get; init; }
    public DateTime HireDate { get; init; } = DateTime.UtcNow;
    public DateTime? DateOfBirth { get; init; }
    public Gender Gender { get; init; }
    public int DepartmentId { get; init; }
    public string? DepartmentName { get; init; }
    public int DesignationId { get; init; }
    public string? DesignationTitle { get; init; }
    public EmploymentType EmploymentType { get; init; }
    public decimal BasicSalary { get; init; }
    public EmployeeStatus Status { get; init; }
    public int? UserId { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

public record CreateEmployeeDto
{
    public string EmployeeCode { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? Address { get; init; }
    public DateTime HireDate { get; init; } = DateTime.UtcNow;
    public DateTime? DateOfBirth { get; init; }
    public Gender Gender { get; init; }
    public int DepartmentId { get; init; }
    public int DesignationId { get; init; }
    public EmploymentType EmploymentType { get; init; }
    public decimal BasicSalary { get; init; }
}

public record UpdateEmployeeDto
{
    public string EmployeeCode { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? Address { get; init; }
    public DateTime HireDate { get; init; } = DateTime.UtcNow;
    public DateTime? DateOfBirth { get; init; }
    public Gender Gender { get; init; }
    public int DepartmentId { get; init; }
    public int DesignationId { get; init; }
    public EmploymentType EmploymentType { get; init; }
    public decimal BasicSalary { get; init; }
    public EmployeeStatus Status { get; init; }
}

public record EmployeeListDto
{
    public int Id { get; init; }
    public string EmployeeCode { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? DepartmentName { get; init; }
    public string? DesignationTitle { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime HireDate { get; init; } = DateTime.UtcNow;
}
