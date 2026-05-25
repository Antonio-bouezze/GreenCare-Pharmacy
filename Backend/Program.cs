
using System.Text;//for encoding like utf8 etc..
using Microsoft.AspNetCore.Authentication.JwtBearer;// to import jwtbearer authenttication...
using Microsoft.EntityFrameworkCore;//its used for db connection and migration
using Microsoft.IdentityModel.Tokens;//for token classes like tokenvalidationparam....
using Pharmacy.Api.Data;// to use db 
using Pharmacy.Api.Middleware;//for errorhandlingmiddleware
using Pharmacy.Api.Services;//to register backend services like tokenservice authservice prodsrvice etc...

var builder = WebApplication.CreateBuilder(args);//to prepare the app

builder.Services.AddControllers();//api
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>//to allow front to call backend
{
    options.AddPolicy("ReactClient", policy =>
    {
        var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? ["http://localhost:5173"];
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();//htttp
    });
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing.");//token must be checked if its localy created 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters//check for valid tokens
        {
            ValidateIssuer = true,//creator
            ValidateAudience = true,//for who
            ValidateLifetime = true,//expiry
            ValidateIssuerSigningKey = true,//valid
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),//converting bcz cryptogrphic uses bytes
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();//checck perm(either admin or normal usrr)
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthService>();//login
builder.Services.AddScoped<ProductService>();//searchingandsorting
builder.Services.AddScoped<OrderService>();//checkout/order

var app = builder.Build();//app is runnig

app.UseMiddleware<ErrorHandlingMiddleware>();//catches error and return json object 

if (app.Environment.IsDevelopment())//if app is in dev mode generate the test page which is swagger
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("ReactClient");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();//to connecct controller route to the app 

using (var scope = app.Services.CreateScope())//check for db existance
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.Run();
