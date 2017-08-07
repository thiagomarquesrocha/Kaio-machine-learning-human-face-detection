package com.oceanbrasil.probabilityface.vision;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.vision.CameraSource;
import com.google.android.gms.vision.face.FaceDetector;
import com.google.android.gms.vision.face.LargestFaceFocusingProcessor;

import java.io.IOException;

/**
 * Created by Alessandro on 24/03/2017.
 */

public class ProbabilityFace {

    private static final String TAG = ProbabilityFace.class.getSimpleName();

    private Context context;
    private FaceDetector mFaceDetector;
    private CameraSource mCameraSource;
    private FaceTracker.OnFaceProbability onFaceProbability;

    public ProbabilityFace(Context context, FaceTracker.OnFaceProbability onFaceProbability) {
        this.context = context;
        this.onFaceProbability = onFaceProbability;
        createCameraSource();
    }

    public void startCamera(){
        if (mCameraSource != null){
            try {
                mCameraSource.start();
            } catch (IOException | SecurityException e) {
                e.printStackTrace();
            }
        }
    }

    public void cameraOnPause(){
        if (mCameraSource != null){
            mCameraSource.stop();
        }
    }

    public void cameraOnDestroy(){
        if (mFaceDetector != null && mCameraSource != null){
            mFaceDetector.release();
            mCameraSource.release();
        }
    }

    private void createCameraSource (){
        mFaceDetector = new FaceDetector.Builder(context)
                .setProminentFaceOnly(true) // optimize for single, relatively large face (Para uma unica face, face relativamente grande)
                .setTrackingEnabled(true) // enable face tracking (Ativar o rastreamento de rosto)
                .setClassificationType(/* eyes open and smile */ FaceDetector.ALL_CLASSIFICATIONS) // olhos e sorrisos
                .setMode(FaceDetector.FAST_MODE) // for one face this is OK (Deteccao rapida)
                .build();

        // now that we've got a detector, create a processor pipeline to receive the detection
        // results (Processar os dados que recebe da deteccao)
        mFaceDetector.setProcessor(new LargestFaceFocusingProcessor(mFaceDetector, new FaceTracker(onFaceProbability)));

        // operational...?
        // operacional ?
        if (!mFaceDetector.isOperational()) {
            Log.w(TAG, "createCameraResources: detector NOT operational");
        } else {
            Log.d(TAG, "createCameraResources: detector operational");
        }

        // Create camera source that will capture video frames
        // criar camera que captura os frames(quadros) de video
        // Use the front camera
        // Usar a camera frontal
        mCameraSource = new CameraSource.Builder(context, mFaceDetector)
                .setRequestedPreviewSize(640, 480)
                .setFacing(CameraSource.CAMERA_FACING_FRONT)
                .setRequestedFps(30f)
                .build();
    }

}