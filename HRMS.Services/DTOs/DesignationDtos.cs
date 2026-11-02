namespace HRMS.Services.DTOs;

public record DesignationDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public int DepartmentId { get; init; }
    public string? DepartmentName { get; init; }
    public string? Grade { get; init; }
    public decimal MinSalary { get; init; }
    public decimal MaxSalary { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

public record CreateDesignationDto
{
    public string Title { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public int DepartmentId { get; init; }
    public string? Grade { get; init; }
    public decimal MinSalary { get; init; }
    public decimal MaxSalary { get; init; }
}

public record UpdateDesignationDto
{
    public string Title { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public int DepartmentId { get; init; }
    public string? Grade { get; init; }
    public decimal MinSalary { get; init; }
    public decimal MaxSalary { get; init; }
}
