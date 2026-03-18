# [Sportball](https://sportsball.leedyer.com/) - All your sports in one place.

## Built with Next.js, Tailwind, React, Supabase, and Shadcn.


## Notes taken in progress

- `lib/supabase/` handles every call to supabase using a server side client which is re-created for each fetch [per their documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=middleware) and utilizes the proxy (middleware) to intercept and validate each call with JWT tokens. I opted here to not even include the client.ts for browser side fetching as the instructions were to use actions and api/ routes instead.

- Enabled Row Level Security knowing it will take more time to set up, but by default be more secure. I've used this in the past and remember it giving me trouble, but ultimately worth the work. Basically IAM roles for tables built in to Supabase. Nicer now than when I used it - the GUI works better. Going to try to use the sql editor when possible so I get more hands on with the data (And so I have a history to look back on)

- Also enabled real time subscription though I'm less sure of this it seems like what I'd expect from a db: instant changes reflected.

- Included timezone in events => increases complexity but also ensures less bugs... In form I'll need to collect
  - date, start time, end time, and timezone
  - combine them all together to create the timestampz type required prior to sending to supabase

Sketched psuedo data
    id: primary
    created_at: auto timestamp
    venue: string
    time_start: timestampz
    time_end: timestampz
    activity: enum // as in which sport, but also left open to be any kind of event (meet and greet with pro athelete etc...)

- should I make table of venues? I think not for now - if I can get through the rest I may specify which venues and use an id to reference. I did make activity an Enum "Pickleball" | "Tennis" | "Basketball" | "Soccer" (sorry football got lazy)

To make the enum used the sql editor:

```SQL
CREATE TYPE activity AS ENUM('Soccer', 'Basketball', 'Tennis', 'Pickleball')
```
 

 To access the rls for events a wide open SELECT sql statement:
```SQL
CREATE POLICY "allow all" ON events
FOR SELECT USING (true);
```


- Before I even bothered styling, used figma to create a mockup for the two pages:
![/public/images/login.png](public/images/login.png)
![public/images/dashboard.png](public/images/dashboard.png)

I have the login form working to a degree - supabase auth handles encryption and auth.user table automatically. But I have a confirm password field that should only show up on the sign up page not on a general log in. Also - I confirmed my email from supabase, but still not logging in properly... need to fix auth LOGIN and redirect

A lot of issues with auth - because I was attempting to use both next.js AND supabase auth (forgot I started with next and switched to supabase) so the proxy was fighting me. Working well now with both Sign In and Log in page that are using shared utils and "Check Email" card for email validation.

Because of RLS - lots of policies needed to be added - one each for reading each table and to ensure you only see your own data, and another for each table for inserts, another for deletes and another for edits. 

Edit will require another level of work: prefilling forms and resubmitting the diff between what is already in database and what is in the form. 

I've definitely blown past the 2-3 hour mark. 

Implemented date-fns for date manipulation and date-fns-tz to create a timezone helper so I can use only valid timezones but also restrict them to areas in US and Canada. Timezones were a huge pain at my first job and I recall we used a library possibly luxon, but it was still quite a pain. This is a simplified version and not global which would take a good deal more time and testing.

Update working reusing the same forms. Proud of my ability to reuse the forms and the modularized utils for each of them. This meant I could fix things in one place and kept ui logic away from business logic. 

Having AI help with making tests now so I don't break anything while I'm at the eleventh hour (quite literally) It went a bit crazy, I trimmed them back to just server actions and the raw util functions.

Using Cursor to speed up at the end of this and implement the remaining feature: search by venue and name. 

Added a custom domain to my personal site to host this at [sportsball.leedyer.com](https://sportsball.leedyer.com)

Implemented Suspense in SearchAnd Filter to allow showing a basic shape while running queries. 

Added [documentation](/docs/search-and-filter-implementation.md) for the [search-and-fiilter.tsx](/components/Stats/SearchAndFilter.tsx)

Note: I usually keep components each in a folder like
 Components/
   FormOne
     FormOne.tsx
     utils.ts
   ButtonOne
     ButtonOne.tsx
     utils.ts
     style.css
But since shadcn did not follow this in their ui folder I decided not to either. 
Additionally, it felt right since this was a limited app to keep all stats dashboard related components as siblings, but in a larger app I would have spread these out a bit more based on type of component. 

Overall this was a highly engaging and challenging implementation and I learned and relearned a lot in the process about Next internals (Throwing for redirects for example), and how to use supabase again.

Was about done - but the auth buttons were not showing up in deployment. Worked fine locally but showed up with no width or color. I am still not sure how this happened, but to fix it I switched to custom styles for each and now they are viewable again. 

I also noticed just now that if you type the wrong password there is no feedback so adding some error handling as a last bit of polish to the auth flow.

Another bug - you are able to sign in with a new user from login form. Originally I designed it this way - a single form for login/signup but I ended up switching to two forms because I didn't want to have to confirm my password to log in, but when I did that I kept the working function. Now I'm splitting them up so we don't have accidental signups when there are typos in emails during login

I removed the email check for supabase - in real life implementation I would keep this on, but as this is a demo I'm fine with the easy access. Removing the now unused component