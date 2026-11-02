using System.Security.Claims;
using HRMS.Core.Entities;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class LeaveController : ControllerBase
{
    private readonly ILeaveService _service;
    private readonly UserManager<ApplicationUser> _userManager;
    public LeaveController(ILeaveService service, UserManager<ApplicationUser> userManager)
    {
        _service = service;
        _userManager = userManager;
    }

    // Angular calls POST /api/leave (no /apply segment)
    [HttpPost]
    public async Task<ActionResult<LeaveRequestDto>> ApplyRoot([FromBody] ApplyLeaveDto dto)
        => await Apply(dto);

    [HttpPost("apply")]
    public async Task<ActionResult<LeaveRequestDto>> Apply([FromBody] ApplyLeaveDto dto)
    {
        try
        {
            var created = await _service.ApplyLeaveAsync(dto);
            return created is null ? BadRequest() : Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Angular calls POST /api/leave/{id}/approve (POST, not PUT)
    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<LeaveRequestDto>> ApprovePost(int id, [FromBody] ApproveLeaveDto dto)
        => await Approve(id, dto);

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<LeaveRequestDto>> Approve(int id, [FromBody] ApproveLeaveDto dto)
    {
        try
        {
            var approved = await _service.ApproveLeaveAsync(id, dto);
            return approved is null ? NotFound() : Ok(approved);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Angular calls POST /api/leave/{id}/reject (POST, not PUT)
    [HttpPost("{id:int}/reject")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<LeaveRequestDto>> RejectPost(int id, [FromBody] ApproveLeaveDto dto)
        => await Reject(id, dto);

    [HttpPut("{id:int}/reject")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<LeaveRequestDto>> Reject(int id, [FromBody] ApproveLeaveDto dto)
    {
        try
        {
            var rejected = await _service.RejectLeaveAsync(id, dto);
            return rejected is null ? NotFound() : Ok(rejected);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        try
        {
            return await _service.CancelLeaveAsync(id) ? NoContent() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Angular calls GET /api/leave/mine — return leaves for the currently logged-in user.
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> Mine()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();
        var user = await _userManager.FindByIdAsync(userIdStr);
        if (user is null || user.EmployeeId is null)
            return Ok(Array.Empty<LeaveRequestDto>());
        return Ok(await _service.GetByEmployeeAsync(user.EmployeeId.Value));
    }

    // Angular calls GET /api/leave?status=Pending — return all leaves, optionally filtered by status.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> GetAll([FromQuery] string? status)
    {
        var all = await _service.GetAllAsync();
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<HRMS.Core.Enums.LeaveStatus>(status, true, out var statusEnum))
        {
            all = all.Where(l => l.Status == statusEnum);
        }
        return Ok(all);
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> Pending() => Ok(await _service.GetPendingAsync());

    // Angular calls /api/leave/employee/{id} (without "by-" prefix)
    [HttpGet("employee/{employeeId:int}")]
    public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> GetByEmployee(int employeeId)
        => Ok(await _service.GetByEmployeeAsync(employeeId));

    [HttpGet("by-employee/{employeeId:int}")]
    public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> GetByEmployeeLegacy(int employeeId)
        => Ok(await _service.GetByEmployeeAsync(employeeId));
}
