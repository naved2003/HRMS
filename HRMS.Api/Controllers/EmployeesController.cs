using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;
    public EmployeesController(IEmployeeService service) => _service = service;

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<EmployeeListDto>>> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("active")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<EmployeeListDto>>> GetActive() => Ok(await _service.GetActiveAsync());

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<EmployeeDto>> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("{id:int}/details")]
    [Authorize]
    public async Task<ActionResult<EmployeeDto>> GetWithDetails(int id)
    {
        var dto = await _service.GetEmployeeWithDetailsAsync(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("by-department/{departmentId:int}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<EmployeeListDto>>> GetByDepartment(int departmentId)
        => Ok(await _service.GetByDepartmentAsync(departmentId));

    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<EmployeeDto>> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
