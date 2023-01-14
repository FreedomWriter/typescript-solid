import * as esbuild from "esbuild-wasm";
import { Accessor, createEffect, createSignal, onMount } from "solid-js";
import { Title } from "solid-start";

const [ref, setRef] = createSignal<any>({ current: undefined });
export default function Home() {
  const [value, setValue] = createSignal("");
  const [code, setCode] = createSignal("");

  const startService: () => Promise<void> = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
    setRef({ current: { ...service } });
  };
  const handleClick = async (): Promise<(() => () => void) | undefined> => {
    await startService();
    if (!ref()?.current) {
      return;
    }

    const res = await ref()?.current.transform(value(), {
      loader: "jsx",
      target: "es2015",
    });

    setCode(res.code);
  };

  let inputRef!: HTMLTextAreaElement;
  const handleChange: () => void = () => {
    setValue(inputRef.value);
  };

  return (
    <main>
      <Title>Solid App</Title>
      <section>
        <textarea
          onChange={(e) => console.log(e.target.textContent)}
          id="userInput"
          name="userInput"
          ref={inputRef}
          onInput={handleChange}
        />
        <div>
          <button type="submit" onClick={handleClick}>
            Submit
          </button>
        </div>
        <pre>{code()}</pre>
      </section>
    </main>
  );
}
