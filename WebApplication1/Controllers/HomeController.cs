﻿namespace WebApplication1.Controllers
{
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Grid()
        {
            ViewBag.Title = "Grid";

            return View();
        }
    }
}
