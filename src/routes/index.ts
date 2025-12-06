import { Router, Request, Response } from 'express';
import { TrafficViolationTypeController } from '../controllers/TrafficViolationTypeController';
import { DriverController } from '../controllers/DriverController';
import { VehicleController } from '../controllers/VehicleController';
import { TrafficViolationController } from '../controllers/TrafficViolationController';

const router = Router();

const trafficViolationTypeController = new TrafficViolationTypeController();
const driverController = new DriverController();
const vehicleController = new VehicleController();
const trafficViolationController = new TrafficViolationController();

// Traffic Violation Types Routes
router.get('/traffic-violation-types', (req: Request, res: Response) => trafficViolationTypeController.findAll(req, res));
router.get('/traffic-violation-types/:id', (req: Request, res: Response) => trafficViolationTypeController.findById(req, res));
router.post('/traffic-violation-types', (req: Request, res: Response) => trafficViolationTypeController.create(req, res));
router.put('/traffic-violation-types/:id', (req: Request, res: Response) => trafficViolationTypeController.update(req, res));
router.delete('/traffic-violation-types/:id', (req: Request, res: Response) => trafficViolationTypeController.delete(req, res));

// Drivers Routes
router.get('/drivers', (req: Request, res: Response) => driverController.findAll(req, res));
router.get('/drivers/violators', (req: Request, res: Response) => driverController.getViolatorsByPoints(req, res));
router.get('/drivers/:id', (req: Request, res: Response) => driverController.findById(req, res));
router.post('/drivers', (req: Request, res: Response) => driverController.create(req, res));
router.put('/drivers/:id', (req: Request, res: Response) => driverController.update(req, res));
router.delete('/drivers/:id', (req: Request, res: Response) => driverController.delete(req, res));

// Vehicles Routes
router.get('/vehicles', (req: Request, res: Response) => vehicleController.findAll(req, res));
router.get('/vehicles/species/:species', (req: Request, res: Response) => vehicleController.findBySpecies(req, res));
router.get('/vehicles/:id', (req: Request, res: Response) => vehicleController.findById(req, res));
router.post('/vehicles', (req: Request, res: Response) => vehicleController.create(req, res));
router.put('/vehicles/:id', (req: Request, res: Response) => vehicleController.update(req, res));
router.delete('/vehicles/:id', (req: Request, res: Response) => vehicleController.delete(req, res));

// Traffic Violations Routes
router.get('/traffic-violations', (req: Request, res: Response) => trafficViolationController.findAll(req, res));
router.get('/traffic-violations/detailed', (req: Request, res: Response) => trafficViolationController.getDetailedList(req, res));
router.get('/traffic-violations/:id', (req: Request, res: Response) => trafficViolationController.findById(req, res));
router.post('/traffic-violations', (req: Request, res: Response) => trafficViolationController.create(req, res));
router.put('/traffic-violations/:id', (req: Request, res: Response) => trafficViolationController.update(req, res));
router.delete('/traffic-violations/:id', (req: Request, res: Response) => trafficViolationController.delete(req, res));

export default router;

