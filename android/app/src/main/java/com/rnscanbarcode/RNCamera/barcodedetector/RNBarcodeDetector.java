package com.rnscanbarcode.RNCamera.barcodedetector;

import android.content.Context;
import android.util.SparseArray;

import com.google.android.gms.vision.barcode.Barcode;
import com.google.android.gms.vision.barcode.BarcodeDetector;

import com.rnscanbarcode.RNCamera.camera.utils.ImageDimensions;
import com.rnscanbarcode.RNCamera.frame.RNFrame;

public class RNBarcodeDetector {

    public static int NORMAL_MODE = 0;
    public static int ALTERNATE_MODE = 1;
    public static int INVERTED_MODE = 2;
    public static int ALL_FORMATS = Barcode.ALL_FORMATS;

    private BarcodeDetector mBarcodeDetector = null;
    private ImageDimensions mPreviousDimensions;
    private BarcodeDetector.Builder mBuilder;

    private int mBarcodeType = Barcode.ALL_FORMATS;

    public RNBarcodeDetector(Context context) {
        mBuilder = new BarcodeDetector.Builder(context)
                .setBarcodeFormats(mBarcodeType);
    }

    // Public API

    public boolean isOperational() {
        if (mBarcodeDetector == null) {
            createBarcodeDetector();
        }

        return mBarcodeDetector.isOperational();
    }

    public SparseArray<Barcode> detect(RNFrame frame) {
        // If the frame has different dimensions, create another barcode detector.
        // Otherwise we will most likely get nasty "inconsistent image dimensions" error from detector
        // and no barcode will be detected.
        if (!frame.getDimensions().equals(mPreviousDimensions)) {
            releaseBarcodeDetector();
        }

        if (mBarcodeDetector == null) {
            createBarcodeDetector();
            mPreviousDimensions = frame.getDimensions();
        }

        return mBarcodeDetector.detect(frame.getFrame());
    }

    public void setBarcodeType(int barcodeType) {
        if (barcodeType != mBarcodeType) {
            release();
            mBuilder.setBarcodeFormats(barcodeType);
            mBarcodeType = barcodeType;
        }
    }


    public void release() {
        releaseBarcodeDetector();
        mPreviousDimensions = null;
    }

    // Lifecycle methods

    private void releaseBarcodeDetector() {
        if (mBarcodeDetector != null) {
            mBarcodeDetector.release();
            mBarcodeDetector = null;
        }
    }

    private void createBarcodeDetector() {
        mBarcodeDetector = mBuilder.build();
    }
}
