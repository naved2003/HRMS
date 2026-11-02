namespace HRMS.Services.DTOs;

public record DepartmentDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int? ManagerId { get; init; }
    public string? ManagerName { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

public record CreateDepartmentDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int? ManagerId { get; init; }
}

public record UpdateDepartmentDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int? ManagerId { get; init; }
}
