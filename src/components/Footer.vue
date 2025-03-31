<template>
    <ion-footer>
        <ion-toolbar>
            <ion-title>MercaBit - © 2025 - Todos los derechos reservados</ion-title>
        </ion-toolbar>
    </ion-footer>
</template>

<script setup>
import { IonFooter, IonToolbar, IonTitle } from '@ionic/vue';
</script>

<style scoped>
ion-footer {
    /* Reduce el tamaño de la letra */
    color: white;
    /* Color del texto */
    border-radius: 20px 20px 0 0;
    /* Esquinas redondeadas arriba */
    overflow: hidden;
    /* Asegura que el borde redondeado se mantenga */
    position: fixed;
    /* Fijar el footer en la parte inferior */
    bottom: 0;
    width: 100%;
}

ion-title {
    font-size: 13px;
    /* Tamaño de la letra */
    color: white;
    /* Color del texto */

}
ion-toolbar {
    text-align: center;
    padding: 5px;
    /* Espaciado para que se vea mejor */
}
</style>