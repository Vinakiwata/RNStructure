package com.rnscanbarcode.RNCamera.camera.tasks;

import com.facebook.react.bridge.WritableArray;
import com.rnscanbarcode.RNCamera.barcodedetector.RNBarcodeDetector;

public interface BarcodeDetectorAsyncTaskDelegate {

    void onBarcodesDetected(WritableArray barcodes, int width, int height, byte[] imageData);

    void onBarcodeDetectionError(RNBarcodeDetector barcodeDetector);

    void onBarcodeDetectingTaskCompleted();
}
