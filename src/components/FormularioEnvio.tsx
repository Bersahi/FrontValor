import React from 'react';
import { ArrowLeft, User, MapPin, Package, Send, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FormularioEnvioProps {
  formularioEnvio: any;
  setFormularioEnvio: React.Dispatch<React.SetStateAction<any>>;
  handleSubmitEnvio: (e: React.FormEvent) => Promise<void>;
  handleDepartamentoChange: (departamento: string, tipo: 'remitente' | 'destinatario') => void;
  handlePaisChange: (pais: string, tipo: 'remitente' | 'destinatario') => void;
  volverAtras: () => void;
  cargandoIA: boolean;
  departamentosGuatemala: Array<{value: string, label: string, region: string}>;
  paisesDisponibles: Array<{value: string, label: string}>;
  monedasDisponibles: Array<{value: string, label: string, symbol: string}>;
  tarifasMock: Array<any>;
}

export const FormularioEnvio: React.FC<FormularioEnvioProps> = ({
  formularioEnvio,
  setFormularioEnvio,
  handleSubmitEnvio,
  handleDepartamentoChange,
  handlePaisChange,
  volverAtras,
  cargandoIA,
  departamentosGuatemala,
  paisesDisponibles,
  monedasDisponibles,
  tarifasMock
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={volverAtras}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Realizar Envío</h1>
      </div>

      <form onSubmit={handleSubmitEnvio} className="space-y-8">
        {/* Información del Remitente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Remitente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="remitente-nombre">Nombre completo</Label>
                <Input
                  id="remitente-nombre"
                  value={formularioEnvio.remitente.nombre}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, nombre: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="remitente-telefono">Teléfono</Label>
                <Input
                  id="remitente-telefono"
                  value={formularioEnvio.remitente.telefono}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, telefono: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="remitente-direccion">Dirección</Label>
                <Input
                  id="remitente-direccion"
                  value={formularioEnvio.remitente.direccion}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, direccion: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="remitente-municipio">Municipio</Label>
                <Input
                  id="remitente-municipio"
                  value={formularioEnvio.remitente.municipio}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, municipio: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="remitente-departamento">Departamento</Label>
                <Select 
                  value={formularioEnvio.remitente.departamento}
                  onValueChange={(value) => handleDepartamentoChange(value, 'remitente')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentosGuatemala.map((departamento) => (
                      <SelectItem key={departamento.value} value={departamento.value}>
                        {departamento.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="remitente-pais">País</Label>
                <Select 
                  value={formularioEnvio.remitente.pais}
                  onValueChange={(value) => handlePaisChange(value, 'remitente')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paisesDisponibles.map((pais) => (
                      <SelectItem key={pais.value} value={pais.value}>
                        {pais.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="remitente-region">Región (Automática)</Label>
                <Input
                  id="remitente-region"
                  value={formularioEnvio.remitente.region}
                  disabled
                  className="bg-gray-100 text-gray-600"
                  placeholder="Se asigna automáticamente según departamento"
                />
              </div>
              <div>
                <Label htmlFor="remitente-ciudad">Ciudad</Label>
                <Input
                  id="remitente-ciudad"
                  value={formularioEnvio.remitente.ciudad}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, ciudad: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="remitente-codigo">Código postal</Label>
                <Input
                  id="remitente-codigo"
                  value={formularioEnvio.remitente.codigoPostal}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    remitente: { ...prev.remitente, codigoPostal: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Destinatario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información del Destinatario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destinatario-nombre">Nombre completo</Label>
                <Input
                  id="destinatario-nombre"
                  value={formularioEnvio.destinatario.nombre}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, nombre: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinatario-telefono">Teléfono</Label>
                <Input
                  id="destinatario-telefono"
                  value={formularioEnvio.destinatario.telefono}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, telefono: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="destinatario-direccion">Dirección</Label>
                <Input
                  id="destinatario-direccion"
                  value={formularioEnvio.destinatario.direccion}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, direccion: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinatario-municipio">Municipio</Label>
                <Input
                  id="destinatario-municipio"
                  value={formularioEnvio.destinatario.municipio}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, municipio: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinatario-departamento">Departamento</Label>
                <Select 
                  value={formularioEnvio.destinatario.departamento}
                  onValueChange={(value) => handleDepartamentoChange(value, 'destinatario')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentosGuatemala.map((departamento) => (
                      <SelectItem key={departamento.value} value={departamento.value}>
                        {departamento.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destinatario-pais">País</Label>
                <Select 
                  value={formularioEnvio.destinatario.pais}
                  onValueChange={(value) => handlePaisChange(value, 'destinatario')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paisesDisponibles.map((pais) => (
                      <SelectItem key={pais.value} value={pais.value}>
                        {pais.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destinatario-region">Región (Automática)</Label>
                <Input
                  id="destinatario-region"
                  value={formularioEnvio.destinatario.region}
                  disabled
                  className="bg-gray-100 text-gray-600"
                  placeholder="Se asigna automáticamente según departamento"
                />
              </div>
              <div>
                <Label htmlFor="destinatario-ciudad">Ciudad</Label>
                <Input
                  id="destinatario-ciudad"
                  value={formularioEnvio.destinatario.ciudad}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, ciudad: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinatario-codigo">Código postal</Label>
                <Input
                  id="destinatario-codigo"
                  value={formularioEnvio.destinatario.codigoPostal}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    destinatario: { ...prev.destinatario, codigoPostal: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Paquete */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información del Paquete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formularioEnvio.paquete.peso}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    paquete: { ...prev.paquete, peso: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dimensiones">Dimensiones (LxAxH cm)</Label>
                <Input
                  id="dimensiones"
                  placeholder="20x15x10"
                  value={formularioEnvio.paquete.dimensiones}
                  onChange={(e) => setFormularioEnvio(prev => ({
                    ...prev,
                    paquete: { ...prev.paquete, dimensiones: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="valor">Valor declarado</Label>
                <div className="flex gap-2">
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formularioEnvio.paquete.valor}
                    onChange={(e) => setFormularioEnvio(prev => ({
                      ...prev,
                      paquete: { ...prev.paquete, valor: e.target.value }
                    }))}
                    required
                  />
                  <Select 
                    value={formularioEnvio.paquete.moneda}
                    onValueChange={(value) => setFormularioEnvio(prev => ({
                      ...prev,
                      paquete: { ...prev.paquete, moneda: value }
                    }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monedasDisponibles.map((moneda) => (
                        <SelectItem key={moneda.value} value={moneda.value}>
                          {moneda.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tipo-servicio">Tipo de servicio</Label>
                <Select 
                  value={formularioEnvio.paquete.tipoServicio}
                  onValueChange={(value) => setFormularioEnvio(prev => ({
                    ...prev,
                    paquete: { ...prev.paquete, tipoServicio: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {tarifasMock.map((tarifa) => (
                      <SelectItem key={tarifa.id} value={tarifa.servicio}>
                        {tarifa.servicio} - {tarifa.precio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción del contenido</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe brevemente el contenido del paquete (requerido por regulaciones aduaneras)"
                value={formularioEnvio.paquete.descripcion}
                onChange={(e) => setFormularioEnvio(prev => ({
                  ...prev,
                  paquete: { ...prev.paquete, descripcion: e.target.value }
                }))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={volverAtras}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={cargandoIA}
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {cargandoIA ? 'Creando y Optimizando...' : 'Crear Envío'}
          </Button>
        </div>

        {/* Información adicional sobre optimización automática */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 rounded-full p-2">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Sistema Automático de IA Logistics</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Al crear tu envío, nuestro sistema de IA automáticamente:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Genera estimación preliminar</strong> basada en distancia, servicio y condiciones</li>
                  <li>• <strong>Determina vehículo óptimo</strong> (moto, van o camión) según características</li>
                  <li>• <strong>Agrupa envíos por región</strong> según departamentos de Guatemala para mayor eficiencia</li>
                  <li>• <strong>Optimiza rutas regionales</strong> para reducir tiempo y costos operativos</li>
                  <li>• <strong>Actualiza estimación</strong> con tiempo más preciso tras optimización</li>
                  <li>• <strong>Notifica automáticamente</strong> cualquier cambio en los tiempos estimados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};