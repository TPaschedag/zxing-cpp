if [ -d "./wasm_build" ]
then
    rm -rf "./wasm_build"
fi

mkdir ./wasm_build
cd ./wasm_build

source ../emsdk/emsdk_env.sh

# building with emcmake
emcmake cmake ../wrappers/wasm .
cmake --build .


# copy zxing reader
cp ./zxing_reader.js ../wrappers/wasm/
cp ./zxing_reader.wasm ../wrappers/wasm/

# copy zxing writer
cp ./zxing_writer.js ../wrappers/wasm/
cp ./zxing_writer.wasm ../wrappers/wasm/

# copy zxing
cp ./zxing.js ../wrappers/wasm/
cp ./zxing.wasm ../wrappers/wasm/

echo done.
