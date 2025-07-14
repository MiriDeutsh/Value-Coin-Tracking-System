
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Coins.Core;

namespace project.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "9e859b6bd3f38b32f52901c400a31f99";

        public CoinsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        private async Task<CoinsModel?> GetCoinByDateAsync(string coinName, DateTime date)
        {
            string formattedDate = date.ToString("yyyy-MM-dd");
            string url = $"https://api.exchangeratesapi.io/v1/{formattedDate}?access_key={_apiKey}";

            try
            {
              

                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode) return null;

                var content = await response.Content.ReadAsStringAsync();
                var json = JsonDocument.Parse(content);

                if (json.RootElement.TryGetProperty("success", out var successProp) && successProp.GetBoolean())
                {
                    var rates = json.RootElement.GetProperty("rates");

                    if (rates.TryGetProperty(coinName.ToUpper(), out var value))
                    {
                        return new CoinsModel
                        {
                            coin = coinName.ToUpper(),
                            date = date,
                            price = value.GetDecimal()
                        };
                    }
                }
            }
            catch
            { 
         
                return null;
            }

            return null;
        }

        private async Task<List<CoinsModel>> GetCoinsInRange(string coinName, int daysBack)
        {
            var list = new List<CoinsModel>();
            var today = DateTime.Today;

            for (int i = 0; i < daysBack; i++)
            {
                var date = today.AddDays(-i);
                var coin = await GetCoinByDateAsync(coinName, date);
                if (coin != null)
                {
                    list.Add(coin);
                }
            }

            return list;
        }

        [HttpGet("week/{coinName}")]
        public async Task<IActionResult> GetWeek(string coinName)
        {
            var result = await GetCoinsInRange(coinName, 7);
            return Ok(result);
        }

        [HttpGet("month/{coinName}")]
        public async Task<IActionResult> GetMonth(string coinName)
        {
            var result = await GetCoinsInRange(coinName, 30);
            return Ok(result);
        }

        [HttpGet("halfyear/{coinName}")]
        public async Task<IActionResult> GetHalfYear(string coinName)
        {
            var result = await GetCoinsInRange(coinName, 182);
            return Ok(result);
        }

        [HttpGet("year/{coinName}")]
        public async Task<IActionResult> GetYear(string coinName)
        {
            var result = await GetCoinsInRange(coinName, 365);
            return Ok(result);
        }
    }
}
