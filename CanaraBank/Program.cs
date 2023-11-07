var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(c => {
	c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin());
});
// Add services to the container.

builder.Services.AddMvc().AddSessionStateTempDataProvider();

builder.Services.AddSession();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}
else
{
	app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();

app.UseCors(options => options.AllowAnyOrigin());

app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Login}/{id?}");

app.Run();
