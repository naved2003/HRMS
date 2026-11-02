using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class SalaryStructuresController : ControllerBase
{
    private readonly IPayrollService _service;
    public SalaryStructuresController(IPayrollService service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<IEnumerable<SalaryStructureDto>>> GetAll()
        => Ok(await _service.GetSalaryStructuresAsync());

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<SalaryStructureDto>> GetById(int id)
    {
        var dto = await _service.GetSalaryStructureByIdAsync(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<SalaryStructureDto>> Create([FromBody] SalaryStructureDto dto)
    {
        var created = await _service.CreateSalaryStructureAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<SalaryStructureDto>> Update(int id, [FromBody] SalaryStructureDto dto)
    {
        var updated = await _service.UpdateSalaryStructureAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }
}
