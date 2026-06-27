plan out the refferral system in this way:
[page.tsx](file;file:///c%3A/Users/ramka/Documents/codebase/webapp/divyansh/spentsmart/src/app/admin/referral/page.tsx)

- the admin able to create refferral link (Information required- name mobile and referralcode(auto genrated)admin can possible create up to 5 refferral and make the active and inactive).[referral-form.tsx](file;file:///c%3A/Users/ramka/Documents/codebase/webapp/divyansh/spentsmart/src/components/marketing/home/referral-form.tsx) take reference.
- the table where the admin get the list all client user thats admin create, self created, regester by link and clients in the table.
- table must have column- name/below mon no., soucre(where the client regester eg refferral, link, self etc ), purchase(what he purchase the value of purchases), sale(if the user has the referral link and the sale came by there clients then the value here), commission( earned commission by there refferral link) and some other column as your prefer.
- if you put delete use then there is only soft delete, the user and user all information inside the DB.
- the row of the user is clickable and open profile page of user.
  plan for USER profile page:
  there have three Tab
- personal information
- the all the earning, sale, revenune, purchase in this tab.
- setting(here he can generate new refferral links an user can possible create up to 5 refferral and make the active and inactive). and other setting which you prefer.
  [page.tsx](file;file:///c%3A/Users/ramka/Documents/codebase/webapp/divyansh/spentsmart/src/app/client/referral/page.tsx) under the client page of /refferral jsut the profile of the user, so he get all the information about the refferral progam.
  plan out for this and planout the if need to remove old system models if not need for this new system
