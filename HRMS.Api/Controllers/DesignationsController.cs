using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DesignationsController : ControllerBase
{
    private readonly IDesignationService _service;
    public DesignationsController(IDesignationService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DesignationDto>>> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<DesignationDto>> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("by-department/{departmentId:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<DesignationDto>>> GetByDepartment(int departmentId)
        => Ok(await _service.GetByDepartmentAsync(departmentId));

    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<DesignationDto>> Create([FromBody] CreateDesignationDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<DesignationDto>> Update(int id, [FromBody] UpdateDesignationDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
