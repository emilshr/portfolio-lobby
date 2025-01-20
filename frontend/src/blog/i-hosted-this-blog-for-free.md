# How I hosted this portfolio for free

I revamped my portfolio from using Astro to using plain old React. In the process, I decided to integrate a [GuestBook](https://emilshr.com/lobby) as well. Currently, I am in the process of learning [GoLang](https://go.dev). Therefore, I decided to write the backend API using Go. My main concern was that I wanted to keep things free, the easiest option for something similar would be to write a Next.js app with tRPC for the API & leverage the free hosting from [Vercel](https://vercel.com). But I really wanted to write this using Go and not stick to the Typescript ecosystem.

There are a couple of different services I've used which are stitched together to make this possible. The services that I have used have a generous free tier while still offering a good number of features. Probably the only thing that has costed me is the domain itself (15$ for a year) from namecheap, its a fair deal in my opinion.

## Some of the things that would have probably costed me

### Hosting the React app

I used [Vercel](https://vercel.com) for this. Their free tier is extremely generous and deploying a static app is really easy. Vercel has a lot of these templates available that detects whatever framework/library you're running and configures your deployment pipeline accordingly. They've got nice features like preview deployments on branches etc.

### Hosting the Go API

This is where I really struggled to find a proper solution. Hosting a go binary (for free) is not as straightforward as I thought it would be. My immediate thought was to dockerize the app & look for services which might offer a cheap solution to run a container.

And I found [Render](https://render.com/). They let you configure a project for free on an instance which has bare minimum configuration. I felt that this configuration (`0.1vCPU & 512MB RAM`) is more than enough to host and run my tiny API.

Of course, there are some caveats like the instance gets shut down automatically after some time of inactivity. I've tackled this by setting up a cron job (using [Cron job](https://cron-job.org/en/)) that pings a health-check endpoint in the API. The cron job can also be set up in the same environment of the project using the Render dashboard. Pretty neat!

### Sending emails (for account confirmation & password reset)

Ever since I saw [Resend](https://resend.com/)'s ads on [X](https://x.com), I've been wanting to check out their service. Setting up an email server along with a custom domain is so easy with their service. With minimal effort, I managed to get `no-reply@notifications.emilshr.com` working. Resend gets a big thumbs up from me if you wanna include email functionalities in your small pet project.
