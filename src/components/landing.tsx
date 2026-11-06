import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cop } from "@/lib/qr/format";
import type { PackageCard } from "@/lib/qr/types";
import { Mark } from "./mark";
import { QrPreview } from "./qr-preview";

export function Landing({ packages }: { packages: PackageCard[] }) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Mark className="h-8 w-8 text-ink" />
          <span className="font-display text-xl">Sello</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 text-sm">
          <a href="#reglas" className="hidden px-3 py-2 text-muted sm:inline">Reglas</a>
          <a href="#precios" className="hidden px-3 py-2 text-muted sm:inline">Paquetes</a>
          <AuthLink />
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:py-16">
        <div>
          <p className="text-sm font-medium tracking-wide text-stamp">Códigos QR para Colombia</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-ink sm:text-6xl">
            Tu marca en el código. El destino lo cambias tú.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Crea hasta 3 códigos gratis con color, forma y logo. Siguen activos si entras al panel al menos una vez al mes.
            Si necesitas más, compra paquetes de 10 a 30 y págalos con Wompi.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <AuthLink large />
            <a href="#precios" className="inline-flex h-12 items-center rounded-full border border-line bg-card px-5 text-sm font-medium">
              Ver paquetes
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-card p-4 shadow-sheet">
          <div className="rounded-lg bg-paper p-3">
            <QrPreview data="Sello" fg="#1c1612" bg="#fffaf3" accent="#b4331e" dotStyle="rounded" cornerStyle="extra-rounded" logo={null} type="svg" />
          </div>
          <p className="mt-3 text-sm text-muted">Color, esquinas y logo. El impreso no cambia aunque edites el destino.</p>
        </div>
      </main>

      <section id="reglas" className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3">
        <Rule title="Tres gratis" body="Cada cuenta puede crear 3 códigos personalizados sin pagar. El cupo lo puedes ajustar desde administración." />
        <Rule title="Entra cada mes" body="Esos tres no se borran. Se pausan solo si pasan más de 30 días sin abrir el panel. Al volver, se reactivan." />
        <Rule title="Pago activo" body="Un paquete dura el periodo que definas (30 días por defecto). Mientras esa fecha no pase, sus códigos funcionan." />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-display text-3xl">Qué puedes personalizar</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Rule title="Color" body="Tinta, fondo y esquinas. El contraste lo marcas tú, para que se lea sobre la mesa o el empaque." />
          <Rule title="Forma" body="Módulos cuadrados, redondos, puntos o clásicos. Las esquinas pueden ir rectas, suaves o en punto." />
          <Rule title="Logo" body="Sube el isotipo en PNG, JPG o WebP. Queda al centro, con corrección de error alta para que igual se escanee." />
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-3xl">Paquetes</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Precios en pesos. El cobro es por el periodo del paquete, no es un débito automático: al vencer, renuevas con otro pago en Wompi.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pack) => (
            <article key={pack.id} className="flex flex-col rounded-3xl border border-line bg-card p-4">
              <h3 className="font-display text-2xl">{pack.name}</h3>
              <p className="mt-2 text-sm text-muted">{pack.description}</p>
              <p className="mt-4 font-display text-3xl tabular-nums">{cop(pack.priceCop)}</p>
              <p className="text-sm text-muted">{pack.qrQuota} códigos · {pack.durationDays} días</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <h2 className="font-display text-3xl">Preguntas frecuentes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Rule title="¿El QR impreso deja de servir?" body="El dibujo no cambia. Apunta a un enlace de Sello. Si el código está en pausa, quien lo escanea ve un aviso en lugar del destino." />
          <Rule title="¿Puedo cambiar el enlace?" body="Sí. Menú, WhatsApp, Wi-Fi, contacto o texto. Guardas y el mismo impreso abre lo nuevo." />
          <Rule title="¿Qué pasa si no entro en un mes?" body="Los 3 gratis se pausan, no se borran. Entras al panel y vuelven a funcionar desde ese momento." />
          <Rule title="¿Y si se vence el paquete?" body="Esos códigos se pausan hasta que pagues de nuevo o alguien de administración extienda la fecha. Los datos se conservan." />
        </div>
      </section>
    </div>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-4">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}

function AuthLink({ large = false }: { large?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const size = large ? "h-12 px-5" : "h-10 px-4";
  if (isPending) return <span className={`inline-block ${size} w-36 animate-pulse rounded-full bg-paper-deep`} />;
  if (user) {
    return (
      <Link to="/panel" className={`inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`}>
        Ir al panel
      </Link>
    );
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className={`inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`}>
          Entrar
        </Link>
      </SignedOut>
      <SignedIn>
        <Link to="/panel" className={`inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`}>
          Ir al panel
        </Link>
      </SignedIn>
    </>
  );
}
