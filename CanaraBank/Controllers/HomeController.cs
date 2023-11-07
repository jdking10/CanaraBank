
using CanaraBank.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Configuration;
using System.Diagnostics;


namespace CanaraBank.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly IConfiguration _configuration;
		string _apiBaseUrl = string.Empty;

		public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
		{
			_configuration = configuration ?? throw new ArgumentNullException(nameof(Configuration));
			_logger = logger;
			_apiBaseUrl = _configuration.GetValue<string>("WebAPIURL");
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]


		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}


		public IActionResult BioAuth()
		{
			return View();
		}
		public IActionResult BioAuthOTP()
		{
			Random generator = new Random();
			String RandoNumeric = generator.Next(0, 1000000).ToString("D6");
			TempData["BioAuthOTP"] = RandoNumeric;
			TempData["UserType"] = HttpContext.Session.GetString("UserType");
			TempData["UniqueId"] = HttpContext.Session.GetString("UniqueId");
			TempData["From"] = "Login";
			return View();
		}

		public IActionResult Verify()
		{
			return View();
		}


		public IActionResult Success()
		{
			return View();
		}


		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}


		public IActionResult Summary()
		{
			return View();
		}




		public IActionResult BioVerify()
		{
			TempData["UniqueId"] = HttpContext.Session.GetString("UniqueId");
			return View();
		}


		public IActionResult Login()
		{
			return View();
		}
		[HttpPost]
		[EnableCors("AllowOrigin")]
		public async Task<IActionResult> Login(string UserId, string Password)
		{
			String apiResponse = string.Empty;
			using (var httpClient = new HttpClient())
			{
				var parameters = new Params() { Id = UserId.ToString() };
				using (var response = await httpClient.PostAsJsonAsync<Params>(_apiBaseUrl + "GetEnrollmentInfo", parameters))
				{
					apiResponse = await response.Content.ReadAsStringAsync();
					apiResponse = JsonConvert.DeserializeObject(apiResponse).ToString();
					TempData["UserType"] = apiResponse;
					TempData["UniqueId"] = UserId.ToString();
					TempData["From"] = "Login";
					HttpContext.Session.SetString("UserType", apiResponse);
					HttpContext.Session.SetString("UniqueId", UserId.ToString());
				}
			}
			return RedirectToAction("BioAuth");
		}
	}
}
public class Params
{
	public string Id { get; set; }
}

