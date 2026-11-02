using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface IDesignationRepository : IRepository<Designation>
{
    Task<IEnumerable<Designation>> GetByDepartmentAsync(int departmentId);
}
