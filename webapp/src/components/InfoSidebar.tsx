import { For, Show } from 'solid-js';
import { sidebarOpen, setSidebarOpen, sidebarContent } from '../stores/uiStore';
import { ChartContainer } from './ChartContainer';

export function InfoSidebar() {
  const content = sidebarContent;

  return (
    <div
      class="fixed top-[117px] right-0 w-[40vw] max-md:w-full h-[calc(100%-117px)] bg-[#f3f3f3] shadow-[-2px_0_5px_rgba(0,0,0,0.2)] transition-transform duration-500"
      style={{ transform: sidebarOpen() ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Handle tab */}
      <button
        class="absolute top-1/2 -translate-y-1/2 -left-10 w-10 py-3.5 bg-blue-600 text-white flex items-center justify-center rounded-l cursor-pointer font-bold text-base"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle info panel"
      >
        <Show
          when={sidebarOpen()}
          fallback={<span class="text-center leading-tight text-xs">I<br/>N<br/>F<br/>O</span>}
        >
          <i class="fas fa-angle-right text-xl" />
        </Show>
      </button>

      {/* Content */}
      <div class="h-full overflow-x-hidden overflow-y-auto bg-[#f3f3f3]">
        <div class="px-[3vw] py-[3vh]">
          <Show when={content()}>
            {c => (
              <>
                <div class="flex justify-between items-center bg-gray-100">
                  <p class="font-bold text-[1.1rem] py-1 flex-1">
                    {c().chapterHeader || c().title}
                  </p>
                  <button
                    class="border-none bg-none text-xl cursor-pointer text-gray-700 hover:text-red-500 px-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <hr class="my-2" />
                <div class="text-[13px] text-justify leading-relaxed">
                  <Show when={c().subpara}>
                    <p class="mb-2" innerHTML={c().subpara} />
                  </Show>
                  <Show when={c().about}>
                    <p class="mb-4" innerHTML={c().about} />
                  </Show>
                  <Show when={c().chartOptions?.length}>
                    <For each={c().chartOptions}>
                      {option => (
                        <div class="mb-4">
                          <ChartContainer option={option} />
                        </div>
                      )}
                    </For>
                  </Show>
                </div>
              </>
            )}
          </Show>
          <Show when={!content()}>
            <div class="flex justify-between items-center bg-gray-100">
              <p class="font-bold text-[1.1rem] py-1 flex-1" />
              <button
                class="border-none bg-none text-xl cursor-pointer text-gray-700 hover:text-red-500 px-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
