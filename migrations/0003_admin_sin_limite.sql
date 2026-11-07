-- Los códigos de administradores no tienen límite ni se pausan.
update qr_codes
set slot = 'admin', entitlement_id = null, updated_at = now()
where user_id in (select user_id from profiles where role = 'admin');
