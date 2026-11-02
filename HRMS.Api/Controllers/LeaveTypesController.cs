using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class LeaveTypesController : ControllerBase
{
    private readonly ILeaveService _service;
    public LeaveTypesController(ILeaveService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<LeaveTypeDto>>> GetAll() => Ok(await _service.GetLeaveTypesAsync());

    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<LeaveTypeDto>> Create([FromBody] LeaveTypeDto dto)
    {
        var created = await _service.CreateLeaveTypeAsync(dto);
        return Ok(created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> Update(int id, [FromBody] LeaveTypeDto dto)
        => await _service.UpdateLeaveTypeAsync(id, dto) ? NoContent() : NotFound();

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteLeaveTypeAsync(id) ? NoContent() : NotFound();
}
