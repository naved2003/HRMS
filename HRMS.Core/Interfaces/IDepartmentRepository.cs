using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<IEnumerable<Department>> GetActiveDepartmentsAsync();
    Task<Department?> GetDepartmentWithManagerAsync(int id);
    Task<bool> IsCodeUniqueAsync(string code);
    Task<bool> IsCodeUniqueForIdAsync(int id, string code);
}
