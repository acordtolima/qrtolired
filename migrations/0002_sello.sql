-- Sello: perfiles, paquetes, pagos y códigos QR dinámicos.

create table if not exists profiles (
  user_id text primary key,
  email text not null default '',
  name text not null default '',
  role text not null default 'user',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists packages (
  id serial primary key,
  name text not null,
  qr_quota integer not null check (qr_quota > 0 and qr_quota <= 500),
  price_cop integer not null check (price_cop >= 0 and price_cop <= 100000000),
  duration_days integer not null default 30 check (duration_days > 0 and duration_days <= 3650),
  description text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists entitlements (
  id serial primary key,
  user_id text not null,
  package_id integer references packages (id) on delete set null,
  package_name text not null,
  qr_quota integer not null,
  price_cop integer not null,
  duration_days integer not null,
  status text not null default 'pending',
  starts_at timestamptz,
  expires_at timestamptz,
  reference text not null unique,
  wompi_transaction_id text,
  payment_method text,
  granted_by text,
  created_at timestamptz not null default now()
);

create index if not exists entitlements_user_idx on entitlements (user_id);
create index if not exists entitlements_status_idx on entitlements (status);

create table if not exists qr_codes (
  id serial primary key,
  user_id text not null,
  public_id text not null unique,
  title text not null default '',
  kind text not null,
  payload text not null,
  destination text not null,
  summary text not null default '',
  slot text not null,
  entitlement_id integer,
  fg_color text not null,
  bg_color text not null,
  accent_color text not null,
  dot_style text not null,
  corner_style text not null,
  logo_data text,
  scans integer not null default 0,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists qr_user_idx on qr_codes (user_id);

create table if not exists app_settings (
  id integer primary key default 1 check (id = 1),
  wompi_public_key text not null default '',
  wompi_integrity_secret text not null default '',
  wompi_events_secret text not null default '',
  wompi_env text not null default 'sandbox',
  allow_demo_checkout boolean not null default true,
  free_qr_limit integer not null default 3,
  free_grace_days integer not null default 30
);

insert into app_settings (id) values (1) on conflict (id) do nothing;

insert into packages (name, qr_quota, price_cop, duration_days, description, sort_order)
select v.name, v.qr_quota, v.price_cop, v.duration_days, v.description, v.sort_order
from (
  values
    ('Paquete 10'::text, 10::int, 49000::int, 30::int, 'Diez códigos dinámicos, con color, forma y logo.'::text, 10::int),
    ('Paquete 15', 15, 69000, 30, 'Quince códigos para un local o un equipo pequeño.', 15),
    ('Paquete 20', 20, 89000, 30, 'Veinte sellos listos para imprimir y reeditar.', 20),
    ('Paquete 25', 25, 109000, 30, 'Veinticinco códigos activos mientras el pago lo esté.', 25),
    ('Paquete 30', 30, 129000, 30, 'Treinta códigos para campañas, mesas o sucursales.', 30)
) as v(name, qr_quota, price_cop, duration_days, description, sort_order)
where not exists (select 1 from packages);
