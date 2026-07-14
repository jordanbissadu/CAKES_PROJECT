"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createOrderRequest,
  type OrderFormState,
} from "@/app/(marketing)/actions";
import {
  ORDER_TYPES,
  SUCRE_OPTIONS,
  CREME_OPTIONS,
} from "@/lib/gallery";
import { useOrderModel } from "./OrderModelContext";

const initial: OrderFormState = { status: "idle" };

const labelCls = "text-[13px] font-bold text-texte";
const controlCls =
  "w-full rounded-input border-[1.5px] border-rose-bonbon bg-blush px-3.5 py-3 text-base text-texte outline-none focus:border-prune";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 rounded-pill bg-framboise px-6 py-3.5 text-base font-bold text-white shadow-[0_5px_16px_rgba(214,51,91,.22)] transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-vin disabled:opacity-50"
    >
      {pending ? "Envoi…" : "Envoyer ma demande"}
    </button>
  );
}

export function OrderForm() {
  const [state, formAction] = useFormState(createOrderRequest, initial);
  const { selectedModel, orderType, details, clearModel, setOrderType, setDetails } =
    useOrderModel();

  if (state.status === "success") {
    return (
      <div className="flex flex-col rounded-[22px] bg-blanc p-7">
        <div className="px-2.5 py-9 text-center">
          <div className="mb-2.5 text-[44px]">🍰</div>
          <h3 className="mb-2 font-display text-[23px] font-bold text-vin">
            Merci {state.customerName} !
          </h3>
          <p className="text-[15px] leading-relaxed text-texte-doux">
            On a bien reçu ta demande. On te rappelle très vite au numéro
            indiqué pour confirmer ton gâteau.
            {state.orderNumber ? (
              <>
                {" "}
                Réf. <b className="text-vin">{state.orderNumber}</b>.
              </>
            ) : null}
          </p>
          {state.orderNumber ? (
            <a
              href="/suivi"
              className="mt-3 text-[15px] font-bold text-prune no-underline"
            >
              Suivre ma commande →
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3.5 rounded-[22px] bg-blanc p-7"
      aria-label="Demande de commande"
    >
      {/* Selected model chip */}
      {selectedModel ? (
        <div className="flex items-center gap-3 rounded-input border-[1.5px] border-rose-bonbon bg-[#FEEAF0] px-3 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedModel.img}
            alt=""
            className="h-[46px] w-[46px] flex-none rounded-[10px] object-cover"
          />
          <div className="flex-1 text-[13px] leading-tight text-prune">
            Modèle choisi : <b className="text-vin">{selectedModel.name}</b>
            <br />
            <span className="text-[#B79AA4]">Réf. {selectedModel.ref}</span>
          </div>
          <button
            type="button"
            onClick={clearModel}
            aria-label="Retirer le modèle"
            className="border-0 bg-none px-1 text-[22px] leading-none text-rose-mauve"
          >
            ×
          </button>
        </div>
      ) : null}

      {/* Hidden model fields */}
      <input type="hidden" name="model_ref" value={selectedModel?.ref ?? ""} />
      <input type="hidden" name="model_name" value={selectedModel?.name ?? ""} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-nom" className={labelCls}>
          Ton nom
        </label>
        <input
          id="f-nom"
          name="customer_name"
          type="text"
          placeholder="Ex. Amira B."
          autoComplete="name"
          required
          className={controlCls}
        />
        {state.fieldErrors?.customer_name ? (
          <span className="text-[13px] font-semibold text-framboise">
            {state.fieldErrors.customer_name}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[520px]:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-tel" className={labelCls}>
            Téléphone
          </label>
          <input
            id="f-tel"
            name="customer_phone"
            type="tel"
            inputMode="tel"
            placeholder="96 628 864"
            autoComplete="tel"
            required
            className={controlCls}
          />
          {state.fieldErrors?.customer_phone ? (
            <span className="text-[13px] font-semibold text-framboise">
              {state.fieldErrors.customer_phone}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-date" className={labelCls}>
            Date souhaitée
          </label>
          <input
            id="f-date"
            name="fulfillment_date"
            type="date"
            className={controlCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-type" className={labelCls}>
          Type de gâteau
        </label>
        <select
          id="f-type"
          name="order_type"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className={controlCls}
        >
          {ORDER_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-message-cake" className={labelCls}>
          Nom / message à écrire sur le gâteau
        </label>
        <input
          id="f-message-cake"
          name="cake_message"
          type="text"
          placeholder="Ex. Joyeux anniversaire Lina 🎂"
          className={controlCls}
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[520px]:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-sucre" className={labelCls}>
            Niveau de sucre
          </label>
          <select id="f-sucre" name="sucre" className={controlCls}>
            {SUCRE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-creme" className={labelCls}>
            Type de crème
          </label>
          <select id="f-creme" name="creme" className={controlCls}>
            {CREME_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-msg" className={labelCls}>
          Autres détails
        </label>
        <textarea
          id="f-msg"
          name="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Nombre de parts, saveurs, décoration, couleurs…"
          className={`${controlCls} min-h-[78px] resize-y`}
        />
      </div>

      {state.status === "error" && state.message ? (
        <p className="text-[14px] font-semibold text-framboise">{state.message}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
