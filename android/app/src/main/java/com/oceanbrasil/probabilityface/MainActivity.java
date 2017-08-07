package com.oceanbrasil.probabilityface;

import android.Manifest;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.oceanbrasil.probabilityface.vision.FaceTracker;
import com.oceanbrasil.probabilityface.vision.ProbabilityFace;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

public class MainActivity extends AppCompatActivity implements FaceTracker.OnFaceProbability {

    private static final String IP_CONFIG = "http://172.25.9.96:8000/detection";
    private static final int REQUEST_CAMERA_PERM = 69;
    ProbabilityFace probabilityFace;

    private TextView tvOlhoDireito,tvOlhoEsquerdo,tvSorriso;

    private Socket mSocket;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // tem permissao?
        if (isCameraPermissionGranted()) {
            initLibFace();
        } else {
            // ...else pede a permissao
            requestCameraPermission();
        }

        bindViews();

    }

    private void bindViews(){
        tvOlhoDireito = (TextView)findViewById(R.id.tv_olho_direito);
        tvOlhoEsquerdo = (TextView)findViewById(R.id.tv_olho_esquerdo);
        tvSorriso = (TextView)findViewById(R.id.tv_sorriso);

        try {
            mSocket = IO.socket(IP_CONFIG);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

    }

    private void initLibFace(){
        probabilityFace = new ProbabilityFace(this,this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (isCameraPermissionGranted()){
            if (probabilityFace != null)
                probabilityFace.startCamera();
        }

    }


    @Override
    protected void onPause() {
        super.onPause();

        if (probabilityFace != null)
            probabilityFace.cameraOnPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (probabilityFace != null)
            probabilityFace.cameraOnDestroy();

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode != REQUEST_CAMERA_PERM) {
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
            return;
        }

        if (grantResults.length != 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            initLibFace();
            return;
        }

        DialogInterface.OnClickListener listener = new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                finish();
            }
        };

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Aplicacao")
                .setMessage("Sem permissão da câmara")
                .setPositiveButton("Ok", listener)
                .show();

    }


    /**
     * Check permissao da camera
     *
     * @return <code>true</code> if granted
     */
    private boolean isCameraPermissionGranted() {
        return ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * Pede a permissao da camera
     */
    private void requestCameraPermission() {
        final String[] permissions = new String[]{Manifest.permission.CAMERA};
        ActivityCompat.requestPermissions(this, permissions, REQUEST_CAMERA_PERM);
    }

    @Override
    public void getLeftEyeOpenProbability(final float probability) {
        Log.d("Ale","olho esquerdo = "+probability);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                tvOlhoEsquerdo.setText(String.format("Olho Esquerdo= %.2f",probability));
            }
        });

    }

    @Override
    public void getRightEyeOpenProbability(final float probability) {
        Log.d("Ale","olho direito = "+probability);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                tvOlhoDireito.setText(String.format("Olho direito = %.2f",probability));
            }
        });

    }

    @Override
    public void getSmilingProbability(final float probability) {
        Log.d("Ale","Sorriso ="+probability);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                tvSorriso.setText(String.format("Sorriso = %.2f",probability));
            }
        });
    }

    @Override
    public void getProbabililtyTogether(float eyeOpen, float eyeRight, float smiling) {

        if (!mSocket.connected()){
            mSocket.connect();
        }

        JSONObject jsonObject = new JSONObject();
        try{
            jsonObject.put("left",String.format("%.2f", eyeOpen));
            jsonObject.put("right",String.format("%.2f", eyeRight));
            jsonObject.put("mouth",String.format("%.2f", smiling));
            mSocket.emit("gesture",jsonObject);
        }catch (JSONException e){
            e.printStackTrace();
        }

    }

}
