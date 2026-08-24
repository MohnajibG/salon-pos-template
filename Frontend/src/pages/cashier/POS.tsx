import { useState } from "react";
import { Receipt } from "lucide-react";

import usePOS from "../../hooks/usePOS";
import useCashRegister from "../../hooks/useCashRegister";

import ClientSelector from "../../components/POS/ClientSelector";
import ServiceSelector from "../../components/POS/ServiceSelector";
import TicketCart from "../../components/POS/TicketCart";
import WaitingAppointments from "../../components/POS/WaitingAppointments";
import TodayAppointments from "../../components/POS/TodayAppointments";
import PaymentBox from "../../components/POS/PaymentBox";
import OpenRegisterModal from "../../components/POS/OpenRegisterModal";
import CloseRegisterModal from "../../components/POS/CloseRegisterModal";
import RegisterStatusBar from "../../components/POS/RegisterStatusBar";

const POS = () => {
  const cashRegister = useCashRegister();
  const pos = usePOS({ onCheckoutSuccess: cashRegister.refresh });

  const [showCloseModal, setShowCloseModal] = useState(false);

  if (cashRegister.loading || pos.loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement de la caisse...
      </div>
    );
  }

  if (!cashRegister.isOpen || !cashRegister.register) {
    return (
      <OpenRegisterModal
        onOpen={cashRegister.open}
        loading={cashRegister.opening}
        error={cashRegister.error}
      />
    );
  }

  const handleClose = async (amount: number, notes?: string) => {
    await cashRegister.close(amount, notes);
    setShowCloseModal(false);
  };

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-(--champagne)">
            Caisse
          </p>
          <h1 className="mt-3 font-title text-3xl font-bold">Flowdesk POS</h1>
          <p className="mt-2 text-sm text-(--muted)">
            Création d'un nouveau ticket
          </p>
        </div>

        <div
          onClick={pos.newTicket}
          className="flex cursor-pointer items-center gap-3 rounded-xl bg-(--cream) px-5 py-3"
        >
          <Receipt size={20} />
          Nouvelle vente
        </div>
      </section>

      <RegisterStatusBar
        register={cashRegister.register}
        onRequestClose={() => setShowCloseModal(true)}
      />

      {pos.error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
          {pos.error}
        </div>
      )}

      {cashRegister.error && !showCloseModal && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
          {cashRegister.error}
        </div>
      )}

      {pos.selectedAppointment && (
        <div className="rounded-2xl bg-green-50 p-4 text-green-700">
          Rendez-vous chargé dans le ticket
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col gap-5 lg:w-[calc(66.667%-8px)]">
          <ClientSelector
            selectedClient={pos.selectedClient}
            search={pos.searchClient}
            setSearch={pos.setSearchClient}
            setClient={pos.setSelectedClient}
          />

          <ServiceSelector
            services={pos.filteredServices}
            search={pos.searchService}
            setSearch={pos.setSearchService}
            addService={pos.addService}
          />

          <WaitingAppointments
            appointments={pos.waitingAppointments}
            selectAppointment={pos.selectAppointment}
          />

          <TodayAppointments onSelect={pos.selectAppointment} />
        </div>

        <div className="lg:w-[calc(33.333%-16px)]">
          <TicketCart
            cart={pos.cart}
            employees={pos.employees}
            removeItem={pos.removeItem}
            updateEmployee={pos.updateEmployee}
            updatePrice={pos.updatePrice}
          />

          <PaymentBox
            total={pos.total}
            paymentMethod={pos.paymentMethod}
            setPaymentMethod={pos.setPaymentMethod}
            saving={pos.saving}
            checkout={pos.checkout}
          />
        </div>
      </div>

      {showCloseModal && (
        <CloseRegisterModal
          register={cashRegister.register}
          onClose={handleClose}
          onCancel={() => setShowCloseModal(false)}
          loading={cashRegister.closing}
          error={cashRegister.error}
        />
      )}
    </div>
  );
};

export default POS;
